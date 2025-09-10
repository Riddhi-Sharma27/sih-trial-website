# backend/search_api.py
from fastapi import FastAPI, Query
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
            "clip_path": clip_url  # return URL instead of absolute path
        })

    return {"results": results}
