'use client'

import { useState } from 'react'
import LiveVideoPlayer from './LiveVideoPlayer'
import { FiEdit2, FiTrash2, FiEye, FiEyeOff, FiPlus } from 'react-icons/fi'
import { MdOutlineControlCamera } from 'react-icons/md'

export default function CctvMonitorGrid({ cctvs: initialCctvs }) {
  // Sort CCTVs so active ones (status: true) are always on top
  const sortedCctvs = [...initialCctvs].sort((a, b) => {
    if (a.status === b.status) return 0
    return a.status ? -1 : 1
  })
  
  const [cctvs, setCctvs] = useState(sortedCctvs)
  const [selectedCctv, setSelectedCctv] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCctv, setEditingCctv] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid, single

  const [formData, setFormData] = useState({
    ipAddress: '',
    city: '',
    latitude: '',
    longitude: '',
    status: true
  })

  // Helper function to determine if stream needs proxy for detection
  const getStreamUrl = (ipAddress, cameraId, cameraName) => {
    // Check if this is a Flask internal stream (already has detection)
    if (ipAddress.includes('127.0.0.1:5000') || ipAddress.includes('localhost:5000')) {
      return ipAddress
    }
    
    // Check if it's an external MJPEG stream that needs detection
    // Format: http://192.168.x.x:port/?action=stream or similar
    if (ipAddress.includes('action=stream') || 
        ipAddress.match(/https?:\/\/\d+\.\d+\.\d+\.\d+/) ||
        ipAddress.includes('.m3u8')) {
      // Route through Flask proxy for detection
      const encodedUrl = encodeURIComponent(ipAddress)
      return `http://127.0.0.1:5000/proxy?url=${encodedUrl}&camera_id=${cameraId}&name=${encodeURIComponent(cameraName)}`
    }
    
    // Default: return original URL
    return ipAddress
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this CCTV?')) return

    try {
      const response = await fetch(`/api/cctvs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setCctvs(cctvs.filter(c => c._id !== id))
        alert('CCTV deleted successfully')
      } else {
        alert('Failed to delete CCTV')
      }
    } catch (error) {
      console.error('Error deleting CCTV:', error)
      alert('Error deleting CCTV')
    }
  }

  const handleEdit = (cctv) => {
    setEditingCctv(cctv)
    setFormData({
      ipAddress: cctv.ipAddress,
      city: cctv.city,
      latitude: cctv.location.latitude,
      longitude: cctv.location.longitude,
      status: cctv.status
    })
    setShowAddForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      ipAddress: formData.ipAddress,
      city: formData.city,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      },
      status: formData.status
    }

    try {
      let response
      if (editingCctv) {
        response = await fetch(`/api/cctvs/${editingCctv._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch('/api/cctvs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        const data = await response.json()
        
        if (editingCctv) {
          const updatedCctvs = cctvs.map(c => c._id === editingCctv._id ? data : c)
          // Re-sort after update
          const sortedCctvs = [...updatedCctvs].sort((a, b) => {
            if (a.status === b.status) return 0
            return a.status ? -1 : 1
          })
          setCctvs(sortedCctvs)
          alert('CCTV updated successfully')
        } else {
          const updatedCctvs = [...cctvs, data]
          // Re-sort after adding
          const sortedCctvs = [...updatedCctvs].sort((a, b) => {
            if (a.status === b.status) return 0
            return a.status ? -1 : 1
          })
          setCctvs(sortedCctvs)
          alert('CCTV added successfully')
        }

        setShowAddForm(false)
        setEditingCctv(null)
        setFormData({
          ipAddress: '',
          city: '',
          latitude: '',
          longitude: '',
          status: true
        })
      } else {
        alert('Failed to save CCTV')
      }
    } catch (error) {
      console.error('Error saving CCTV:', error)
      alert('Error saving CCTV')
    }
  }

  const toggleStatus = async (cctv) => {
    try {
      const response = await fetch(`/api/cctvs/${cctv._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !cctv.status })
      })

      if (response.ok) {
        const data = await response.json()
        const updatedCctvs = cctvs.map(c => c._id === cctv._id ? data : c)
        // Re-sort after status toggle
        const sortedCctvs = [...updatedCctvs].sort((a, b) => {
          if (a.status === b.status) return 0
          return a.status ? -1 : 1
        })
        setCctvs(sortedCctvs)
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'grid' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Grid View 
          </button>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setEditingCctv(null)
            setFormData({
              ipAddress: '',
              city: '',
              latitude: '',
              longitude: '',
              status: true
            })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          <FiPlus className="w-5 h-5" />
          Add CCTV
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCctv ? 'Edit CCTV' : 'Add New CCTV'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stream URL / IP Address
              </label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="http://example.com/stream.m3u8"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City / Location Name
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., Malang, Jakarta"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="-7.9666"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="112.6326"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingCctv(null)
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {editingCctv ? 'Update' : 'Add'} CCTV
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Single View */}
      {viewMode === 'single' && (
        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Camera
            </label>
            <select
              value={selectedCctv?._id || ''}
              onChange={(e) => {
                const cctv = cctvs.find(c => c._id === e.target.value)
                setSelectedCctv(cctv)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a camera...</option>
              {cctvs.map(cctv => (
                <option key={cctv._id} value={cctv._id}>
                  {cctv.city} - {cctv.ipAddress}
                </option>
              ))}
            </select>
          </div>

          {selectedCctv && (
            <div className="bg-white shadow rounded-lg p-6">
              <LiveVideoPlayer
                streamUrl={getStreamUrl(selectedCctv.ipAddress, selectedCctv._id, selectedCctv.city)}
                cameraName={selectedCctv.city}
                cameraId={selectedCctv._id}
                showDetectionBoxes={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cctvs.map(cctv => (
            <div key={cctv._id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* CCTV Info Header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MdOutlineControlCamera className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">{cctv.city}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cctv.status 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {cctv.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{cctv.ipAddress}</p>
                <p className="text-xs text-gray-500 mt-1">
                  GPS: {cctv.location.latitude.toFixed(4)}, {cctv.location.longitude.toFixed(4)}
                </p>
              </div>

              {/* Video Player */}
              <div className="p-4">
                {cctv.status ? (
                  <LiveVideoPlayer
                    streamUrl={getStreamUrl(cctv.ipAddress, cctv._id, cctv.city)}
                    cameraName={cctv.city}
                    cameraId={cctv._id}
                    showDetectionBoxes={true}
                  />
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <FiEyeOff className="w-12 h-12 mx-auto mb-2" />
                      <p>Camera Offline</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleStatus(cctv)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${
                    cctv.status
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {cctv.status ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  {cctv.status ? 'Disable' : 'Enable'}
                </button>

                <button
                  onClick={() => handleEdit(cctv)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(cctv._id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cctvs.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <MdOutlineControlCamera className="w-20 h-20 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No CCTVs Found</h3>
          <p className="text-gray-500 mb-6">Add your first CCTV camera to start monitoring</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Add CCTV Camera
          </button>
        </div>
      )}
    </div>
  )
}
