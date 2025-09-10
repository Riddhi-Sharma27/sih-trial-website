"use client"

import { useState } from "react"
import { Search, Expand, Download, X } from "lucide-react"

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
  const [date, setDate] = useState("today")
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [expandedAlert, setExpandedAlert] = useState<Alert | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-blue-600">Recent Alerts</h2>
        <div className="flex items-center gap-3">
          {/* Date Dropdown */}
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          {/* Critical Only Toggle */}
          <button
            onClick={() => setCriticalOnly(!criticalOnly)}
            className={`px-3 py-1 rounded border ${
              criticalOnly
                ? "bg-red-100 text-red-600 border-red-300"
                : "bg-gray-100 text-gray-600 border-gray-300"
            }`}
          >
            Critical Only
          </button>

          {/* Search Icon */}
          <button className="p-2 rounded bg-gray-100 hover:bg-gray-200">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-6">
        {sampleAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white shadow-md border border-blue-100 rounded-lg p-6 flex gap-6 min-h-[250px]"
          >
            {/* Left: Video Placeholder */}
            <div className="relative w-1/2 min-h-[200px] bg-gray-200 rounded flex items-center justify-center text-gray-500">
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
                <span className="text-sm text-gray-500 ml-auto">
                  {alert.camera}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 flex-1">
                This alert indicates <strong>{alert.title}</strong> detected at{" "}
                <strong>{alert.location}</strong> using{" "}
                <strong>{alert.camera}</strong>. Please review the recorded
                footage and take necessary action.
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
              {expandedAlert.emoji} {expandedAlert.title} –{" "}
              {expandedAlert.location}
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
