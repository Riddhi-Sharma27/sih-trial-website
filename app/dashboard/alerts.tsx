"use client"

import { useState } from "react"
import { Search, Expand, Download, X, Upload } from "lucide-react"

type Alert = {
  id: number
  emoji: string
  title: string
  location: string
  camera: string
  time: string
}

const sampleAlerts: Alert[] = [
  {
    id: 1,
    emoji: "🚨",
    title: "Unauthorized Access",
    location: "Main Entrance",
    camera: "CameraID: 001",
    time: "10:45 AM",
  },
  {
    id: 2,
    emoji: "⚠️",
    title: "Camera Offline",
    location: "Server Room",
    camera: "CameraID: 322",
    time: "09:30 AM",
  },
  {
    id: 3,
    emoji: "🔔",
    title: "After Hours Movement",
    location: "Parking Lot",
    camera: "CameraID: 127",
    time: "08:15 AM",
  },
]

export default function Alerts() {
  const [expandedAlert, setExpandedAlert] = useState<Alert | null>(null)

  // State for uploaded file + analysis result
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedVideo(file)
    setProcessing(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append("video", file)

      // ✅ Calls backend endpoint (FastAPI) → triggers TwillioWhatsappBotFinal.py
      const res = await fetch("http://127.0.0.1:8000/process-video", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      // Expected: { message: "alert text OR no anomaly", scene_description: "..." }

      if (data.message) {
        setAnalysisResult(`${data.message}\n\nScene: ${data.scene_description}`)
      } else {
        setAnalysisResult(`No anomaly detected!\n\nScene: ${data.scene_description}`)
      }
    } catch (err) {
      console.error(err)
      setAnalysisResult("Error processing video")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-blue-600">Alerts</h2>

      {/* Upload Section */}
      <div className="bg-white shadow-md border border-blue-200 rounded-lg p-8 flex flex-col items-center justify-center min-h-[250px]">
        {!uploadedVideo && !analysisResult && !processing && (
          <>
            <Upload className="w-10 h-10 text-gray-500 mb-4" />
            <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Upload Video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </label>
          </>
        )}

        {processing && (
          <p className="text-gray-600 font-medium">Processing video, please wait...</p>
        )}

        {analysisResult && (
          <div className="w-full">
            <h3 className="font-bold text-gray-900 mb-2">Analysis Result</h3>
            <p className="text-gray-700 whitespace-pre-line">{analysisResult}</p>
          </div>
        )}
      </div>

      {/* Recent Alerts Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">Recent Alerts</h3>
        {sampleAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white shadow-md border border-blue-100 rounded-lg p-6 flex gap-6 min-h-[200px]"
          >
            {/* Left: Video Placeholder */}
            <div className="relative w-1/2 min-h-[150px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Video Placeholder
              <div className="absolute top-2 right-2 flex gap-2">
                {/* Expand Button */}
                <button
                  onClick={() => setExpandedAlert(alert)}
                  className="p-2 bg-white shadow rounded hover:bg-gray-100"
                >
                  <Expand className="w-4 h-4 text-gray-600" />
                </button>

                {/* Download Button */}
                <button className="p-2 bg-white shadow rounded hover:bg-gray-100">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Right: Text Section */}
            <div className="flex-1 flex flex-col">
              {/* Title Row */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{alert.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900">
                  {alert.title} – {alert.location}
                </h3>
                <span className="text-sm text-gray-500 ml-auto">{alert.camera}</span>
              </div>

              {/* Description */}
              <p className="text-gray-700 flex-1">
                This alert indicates <strong>{alert.title}</strong> detected at{" "}
                <strong>{alert.location}</strong> using{" "}
                <strong>{alert.camera}</strong>. Please review the recorded footage and
                take necessary action.
              </p>

              {/* Footer Row */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Video Overlay */}
      {expandedAlert && (
        <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
          <div className="bg-white h-full w-full md:w-2/3 p-6 relative shadow-lg">
            {/* Close Button */}
            <button
              onClick={() => setExpandedAlert(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-xl font-bold text-blue-600 mb-4">
              {expandedAlert.emoji} {expandedAlert.title} – {expandedAlert.location}
            </h2>

            {/* Big Video Placeholder */}
            <div className="w-full h-[70%] bg-gray-300 rounded flex items-center justify-center text-gray-600">
              Expanded Video Placeholder
            </div>

            <p className="mt-4 text-gray-700">
              Reviewing footage from <strong>{expandedAlert.camera}</strong> at{" "}
              {expandedAlert.time}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
