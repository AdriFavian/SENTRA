'use client'

import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { FiAlertTriangle, FiX, FiBell, FiBellOff } from 'react-icons/fi'
import { MdOutlineControlCamera } from 'react-icons/md'
import useSound from 'use-sound'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default function RealtimeAlerts() {
  const [alerts, setAlerts] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showNotifications, setShowNotifications] = useState(true)
  const socketRef = useRef(null)

  const [playAlert] = useSound('/warning.mp3', {
    volume: soundEnabled ? 0.5 : 0,
  })

  useEffect(() => {
    // Connect to Socket.IO server
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4001', {
      transports: ['websocket', 'polling'],
      query: {
        'ngrok-skip-browser-warning': 'true'
      }
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server')
      setIsConnected(false)
    })

    socket.on('welcome', (data) => {
      console.log('👋 Welcome message:', data.message)
    })

    // Listen for accident alerts
    socket.on('receive-message', (accident) => {
      console.log('🚨 New accident detected:', accident)
      
      const newAlert = {
        id: accident._id || Date.now(),
        severity: accident.accidentClassification || 'Normal',
        location: accident.cctv?.city || accident.cctv?.ipAddress || 'Unknown',
        timestamp: new Date(),
        photo: accident.photos,
        confidence: accident.confidence || 0.8,
        cctv: accident.cctv,
        description: accident.description || 'Accident detected'
      }

      setAlerts(prev => [newAlert, ...prev].slice(0, 50)) // Keep last 50 alerts

      // Play sound if enabled
      if (soundEnabled) {
        playAlert()
      }

      // Show browser notification if permission granted
      if (showNotifications && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 Accident Detected!', {
          body: `${newAlert.severity} accident at ${newAlert.location}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
        })
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [soundEnabled, showNotifications, playAlert])

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      setShowNotifications(permission === 'granted')
    }
  }

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Fatal':
        return 'bg-red-100 border-red-500 text-red-900'
      case 'Serious':
        return 'bg-orange-100 border-orange-500 text-orange-900'
      case 'Normal':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900'
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Fatal':
        return '🔴'
      case 'Serious':
        return '🟠'
      case 'Normal':
        return '🟡'
      default:
        return '⚪'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Real-time Alerts
          </h2>
          
          {/* Connection Status */}
          <span className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>

          {/* Alert Count */}
          {alerts.length > 0 && (
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
              {alerts.length} {alerts.length === 1 ? 'Alert' : 'Alerts'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg transition ${
              soundEnabled 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          >
            {soundEnabled ? <FiBell className="w-5 h-5" /> : <FiBellOff className="w-5 h-5" />}
          </button>

          {/* Notification Permission */}
          {showNotifications === false && (
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
            >
              Enable Notifications
            </button>
          )}

          {/* Clear All */}
          {alerts.length > 0 && (
            <button
              onClick={clearAllAlerts}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <FiAlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No alerts yet. System is monitoring...</p>
            <p className="text-sm text-gray-400 mt-2">
              {isConnected ? 'Waiting for accident detections' : 'Connecting to server...'}
            </p>
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg shadow-md p-4 ${getSeverityColor(alert.severity)} animate-fade-in`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Alert Icon */}
                  <div className="text-4xl">
                    {getSeverityIcon(alert.severity)}
                  </div>

                  {/* Alert Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">
                        {alert.severity} Accident Detected
                      </h3>
                      <span className="text-xs bg-white/50 px-2 py-1 rounded">
                        {(alert.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">{alert.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MdOutlineControlCamera className="w-4 h-4" />
                        <span>{alert.location}</span>
                      </div>
                      <span>•</span>
                      <span>{dayjs(alert.timestamp).fromNow()}</span>
                    </div>

                    {alert.cctv && (
                      <div className="mt-2 text-xs opacity-75">
                        <span>IP: {alert.cctv.ipAddress}</span>
                        {alert.cctv.location && (
                          <span className="ml-3">
                            GPS: {alert.cctv.location.latitude.toFixed(4)}, {alert.cctv.location.longitude.toFixed(4)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail */}
                  {alert.photo && (
                    <img
                      src={`/${alert.photo}`}
                      alt="Accident snapshot"
                      className="w-32 h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-gray-600 hover:text-gray-900 transition p-1"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
