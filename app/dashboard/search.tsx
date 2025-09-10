"use client"

import { useState } from "react"
import { Search, Clock, Camera } from "lucide-react"

type SearchResult = {
  video: string
  absolute_start_time: string
  absolute_end_time: string
  document: string
  clip_path: string
}

export default function SearchPage() {
  const [characteristic, setCharacteristic] = useState("")
  const [anomaly, setAnomaly] = useState("")
  const [cameraId, setCameraId] = useState("")
  const [time, setTime] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    setLoading(true)
    setError("")
    setResults([])

    try {
      const res = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`)
      if (!res.ok) throw new Error("Failed to fetch search results")
      const data = await res.json()
      setResults(data.results || [])
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Search Records</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search by Characteristics */}
        <div className="bg-white shadow-md border border-blue-100 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Search by Characteristics
          </h3>
          <input
            type="text"
            placeholder="Enter characteristics..."
            value={characteristic}
            onChange={(e) => setCharacteristic(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 flex items-center justify-center gap-2"
            onClick={() => handleSearch(characteristic)}
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </div>

        {/* Search by Anomaly */}
        <div className="bg-white shadow-md border border-blue-100 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Search by Anomaly
          </h3>
          <input
            type="text"
            placeholder="Enter anomaly type..."
            value={anomaly}
            onChange={(e) => setAnomaly(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 flex items-center justify-center gap-2"
            onClick={() => handleSearch(anomaly)}
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </div>

        {/* Search by Camera ID */}
        <div className="bg-white shadow-md border border-blue-100 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Search by Camera ID
          </h3>
          <input
            type="text"
            placeholder="Enter Camera ID..."
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 flex items-center justify-center gap-2"
            onClick={() => handleSearch(cameraId)}
          >
            <Camera className="w-4 h-4" /> Search
          </button>
        </div>

        {/* Search by Time */}
        <div className="bg-white shadow-md border border-blue-100 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Search by Time
          </h3>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 flex items-center justify-center gap-2"
            onClick={() => handleSearch(time)}
          >
            <Clock className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-6">
        {loading && <p className="text-gray-500">Loading results...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((res, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 bg-white shadow">
                <p className="font-semibold text-blue-600">{res.video}</p>
                <p><strong>Start:</strong> {res.absolute_start_time}</p>
                <p><strong>End:</strong> {res.absolute_end_time}</p>
                <p className="text-gray-700">{res.document}</p>
                <video
                  src={`http://127.0.0.1:8000/${res.clip_path.split("/").pop()}`}
                  controls
                  className="w-full mt-2 rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
