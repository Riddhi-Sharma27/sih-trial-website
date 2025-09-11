# backend/search_api.py
from fastapi import FastAPI, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import faiss
import json
import os
import numpy as np
from sentence_transformers import SentenceTransformer
import cv2
import tempfile
import ffmpeg
import shutil
from datetime import datetime
from Sih_ResNet_Anomaly import process_batch

# === Import your pipeline pieces ===
from TwillioWhatsappBotFinal import setup_gemini, analyze_activity_with_gemini, FrameData

# Config
FAISS_INDEX_PATH = "video_library.faiss"
METADATA_PATH = "video_library_metadata.json"
EMBEDDING_MODEL_NAME = 'all-MiniLM-L6-v2'

# Init FastAPI
app = FastAPI()

# Allow frontend (Next.js) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount system temp directory to serve clips
app.mount("/temp", StaticFiles(directory=tempfile.gettempdir()), name="temp")

# Load models/index
embedder = SentenceTransformer(EMBEDDING_MODEL_NAME)
index = faiss.read_index(FAISS_INDEX_PATH)
with open(METADATA_PATH, "r") as f:
    metadata_store = json.load(f)


def extract_clip(video_path, start_frame, fps, duration_sec=20):
    """
    Extracts a ~20 second clip starting from start_frame
    """
    start_time_sec = start_frame / fps
    temp_file = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
    temp_filename = temp_file.name
    temp_file.close()

    (
        ffmpeg
        .input(video_path, ss=start_time_sec)
        .output(temp_filename, t=duration_sec, vcodec="libx264", acodec="aac")
        .overwrite_output()
        .run(quiet=True)
    )
    return temp_filename


@app.get("/search")
def search(query: str = Query(..., description="Search query text")):
    query_embedding = embedder.encode([query])
    distances, indices = index.search(query_embedding, 10)  # top 10 candidates

    results = []
    for idx in indices[0]:
        if idx == -1:
            continue
        metadata = metadata_store[idx]
        video_path = metadata["video_path"]

        # Get fps of video
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        cap.release()

        # Generate temporary clip
        clip_path = extract_clip(video_path, metadata["start_frame"], fps)
        clip_name = os.path.basename(clip_path)
        clip_url = f"/temp/{clip_name}"  # URL served by FastAPI

        results.append({
            "video": os.path.basename(video_path),
            "absolute_start_time": metadata["absolute_start_time"],
            "absolute_end_time": metadata["absolute_end_time"],
            "document": metadata["document"],
            "clip_path": clip_url
        })

    return {"results": results}


# === New endpoint: run uploaded video through ResNet → Gemini ===
@app.post("/process-video")
async def process_video(video: UploadFile = File(...)):
    uploads_dir = "./uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    # Save uploaded file
    temp_path = os.path.join(uploads_dir, video.filename)
    print("video temp_path",temp_path)
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    try:
        gemini_model = setup_gemini()
    except ValueError as e:
        return {"error": str(e)}

    # Open video
    cap = cv2.VideoCapture(temp_path)
    if not cap.isOpened():
        print(f"[ERROR] Could not open video at {temp_path}")
        return {"error": "Unable to open uploaded video."}
    
    print(f"[DEBUG] Successfully opened video: {temp_path}")
    

    fps = cap.get(cv2.CAP_PROP_FPS) or 5
    frame_skip = max(1, int(fps / 5))  # sample ~5 FPS
    frames = []
    frame_count = 0
    analysis_result = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_skip == 0:
            # ✅ resize for ResNet
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_resized = cv2.resize(frame_rgb, (224, 224))
            frames.append(FrameData(frame_resized, datetime.now()))

            # Process in batches
            if len(frames) >= 20:  # BATCH_SIZE
                if process_batch(frames):
                    log_file = f"activity_log_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.jsonl"
                    analysis_result = analyze_activity_with_gemini(frames, gemini_model, log_file)
                    break  # stop after first anomaly analysis
                frames = []  # reset if no anomaly
        frame_count += 1

    cap.release()
    print(f"[DEBUG] Total frames collected: {len(frames)}")
    print(f"[DEBUG] Running process_batch on {len(frames)} frames...")
    is_anomaly = process_batch(frames)
    print(f"[DEBUG] process_batch result: {is_anomaly}")

    # ✅ handle leftover frames if video < 100
    if frames and not analysis_result:
        if process_batch(frames):
            log_file = f"activity_log_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.jsonl"
            analysis_result = analyze_activity_with_gemini(frames, gemini_model, log_file)

    if not analysis_result:
        return {
            "message": "No anomaly detected",
            "scene_description": "No suspicious actions detected",
            "critical_level": "N/A",
        }

    # Make sure scene_description is always a string
    scene_actions = analysis_result.get("activity_description", {}).get("involved_persons_actions", [])
    if not scene_actions:
        scene_actions = ["No clear actions detected"]

    return {
        "message": analysis_result.get("activity_description", {}).get("summary", "No summary"),
        "scene_description": "\n".join(scene_actions),
        "critical_level": analysis_result.get("activity_description", {}).get("critical_level", "N/A"),
    }
