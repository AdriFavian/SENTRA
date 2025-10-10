'use client'

import { useEffect, useRef, useState } from 'react'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi'
import { MdOutlineControlCamera } from 'react-icons/md'
import Hls from 'hls.js'

export default function LiveVideoPlayer({ 
  streamUrl, 
  cameraName, 
  cameraId,
  showDetectionBoxes = true 
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const hlsRef = useRef(null)
  const imgRef = useRef(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showBoxes, setShowBoxes] = useState(showDetectionBoxes)
  const [error, setError] = useState(null)
  const [detections, setDetections] = useState([])
  const [useMjpegFallback, setUseMjpegFallback] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    
    if (!video || !streamUrl) return

    // Check if this is a Flask MJPEG stream
    const isFlaskStream = streamUrl.includes('127.0.0.1:5000') || streamUrl.includes('localhost:5000')
    
    if (isFlaskStream) {
      // Flask MJPEG streams work better with img tag
      console.log('Detected Flask MJPEG stream, using img fallback')
      setUseMjpegFallback(true)
      setIsPlaying(true)
      return
    }

    // Handle HLS streams
    if (streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        
        hlsRef.current = hls
        hls.loadSource(streamUrl)
        hls.attachMedia(video)
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => {
            console.error('Autoplay failed:', err)
            setIsPlaying(false)
          })
          setIsPlaying(true)
        })
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data)
          if (data.fatal) {
            setError(`Streaming error: ${data.type}`)
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamUrl
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(err => {
            console.error('Autoplay failed:', err)
            setIsPlaying(false)
          })
          setIsPlaying(true)
        })
      } else {
        setError('HLS not supported in this browser')
      }
    } else if (streamUrl.startsWith('http')) {
      // Direct stream (MP4, WebM, etc.) - not MJPEG
      video.src = streamUrl
      
      const handleError = () => {
        console.warn('Video element failed, trying MJPEG fallback')
        setUseMjpegFallback(true)
        setIsPlaying(true)
      }
      
      const handleCanPlay = () => {
        video.play().catch(err => {
          console.error('Autoplay failed:', err)
          setIsPlaying(false)
        })
        setIsPlaying(true)
      }
      
      video.addEventListener('error', handleError)
      video.addEventListener('canplay', handleCanPlay)
      
      return () => {
        video.removeEventListener('error', handleError)
        video.removeEventListener('canplay', handleCanPlay)
      }
    } else {
      setError('Unsupported stream format')
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [streamUrl])

  // Draw detection boxes on canvas
  useEffect(() => {
    if (!showBoxes || !canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')

    const drawBoxes = () => {
      if (!video.videoWidth || !video.videoHeight) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      detections.forEach(detection => {
        const { x, y, width, height, label, confidence, color } = detection

        // Draw box
        ctx.strokeStyle = color || '#ef4444'
        ctx.lineWidth = 3
        ctx.strokeRect(x, y, width, height)

        // Draw label background
        ctx.fillStyle = color || '#ef4444'
        const text = `${label} ${(confidence * 100).toFixed(1)}%`
        const textMetrics = ctx.measureText(text)
        ctx.fillRect(x, y - 25, textMetrics.width + 10, 25)

        // Draw label text
        ctx.fillStyle = '#ffffff'
        ctx.font = '14px Arial'
        ctx.fillText(text, x + 5, y - 7)
      })

      requestAnimationFrame(drawBoxes)
    }

    const animationId = requestAnimationFrame(drawBoxes)
    return () => cancelAnimationFrame(animationId)
  }, [detections, showBoxes])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
        console.error('Fullscreen failed:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Simulate detection boxes for demo (in production, this would come from Flask backend)
  useEffect(() => {
    if (!showBoxes) return

    const interval = setInterval(() => {
      // Mock detections - replace with real data from Socket.IO
      const mockDetections = [
        {
          x: Math.random() * 400,
          y: Math.random() * 300,
          width: 100,
          height: 100,
          label: 'Vehicle',
          confidence: 0.85 + Math.random() * 0.15,
          color: '#3b82f6'
        }
      ]
      
      // Only update if we want to show boxes
      if (Math.random() > 0.7) {
        setDetections(mockDetections)
      } else {
        setDetections([])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [showBoxes])

  if (error) {
    return (
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <MdOutlineControlCamera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-red-400 font-semibold">{error}</p>
          <p className="text-gray-400 text-sm mt-2">{cameraName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video group">
      {/* MJPEG Image Fallback (for Flask streams) */}
      {useMjpegFallback ? (
        <img
          ref={imgRef}
          src={streamUrl}
          alt={cameraName}
          className="w-full h-full object-contain"
          onError={() => setError('Failed to load stream')}
        />
      ) : (
        /* Video Element (for HLS and regular video streams) */
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          muted={isMuted}
          playsInline
        />
      )}

      {/* Detection Canvas Overlay */}
      {showBoxes && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      )}

      {/* Camera Name Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
        <MdOutlineControlCamera className="inline mr-2" />
        {cameraName}
      </div>

      {/* Live Badge */}
      {isPlaying && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          LIVE {useMjpegFallback && '(MJPEG)'}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          {!useMjpegFallback && (
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition"
              >
                {isPlaying ? <FiPause className="w-6 h-6" /> : <FiPlay className="w-6 h-6" />}
              </button>
              
              <button
                onClick={toggleMute}
                className="text-white hover:text-blue-400 transition"
              >
                {isMuted ? <FiVolumeX className="w-6 h-6" /> : <FiVolume2 className="w-6 h-6" />}
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">

            {!useMjpegFallback && (
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 transition"
              >
                <FiMaximize className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
