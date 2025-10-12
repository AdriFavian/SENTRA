'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { FiMapPin } from 'react-icons/fi'
import { BiTime } from 'react-icons/bi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import GoogleMapComponent from '@/app/components/GoogleMapComponent'
import toast from 'react-hot-toast'
import { AiOutlineCamera } from 'react-icons/ai'

const AccidentDetailsPage = ({ params }) => {
  const router = useRouter()
  const { id } = params
  const [severity, setSeverity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [data, setData] = useState({})
  const [markers, setMarkers] = useState({})

  useEffect(() => {
    if (id) {
      getAccident()
    }
  }, [id])

  const options = [
    { id: 1, label: 'Fatal', checked: false, color: 'bg-red-500' },
    { id: 2, label: 'Serious', checked: false, color: 'bg-yellow-500' },
    { id: 3, label: 'Normal', checked: false, color: 'bg-blue-500' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!severity) {
      return setError('Please select severity')
    }
    setLoading(true)
    try {
      await fetch('/api/accidents/' + id, {
        method: 'PUT',
        body: JSON.stringify({ accidentClassification: severity }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      setError('Failed to update severity')
    }
    setLoading(false)
    toast.success('Successfully updated severity')
    router.push('/accidents')
    router.refresh()
  }

  const getAccident = async () => {
    try {
      const res = await fetch('/api/accidents/' + id)
      const data = await res.json()
      setData(data)
      // Ensure severity is never null or undefined, default to 'Normal'
      setSeverity(data.accidentClassification || 'Normal')
      setMarkers({
        city: data.cctv.city,
        lat: data.cctv.location.latitude,
        lng: data.cctv.location.longitude,
        position: {
          lat: data.cctv.location.latitude,
          lng: data.cctv.location.longitude,
        },
        ip: data.cctv.ipAddress,
        type: 'accident',
      })
    } catch (error) {
      setError('Failed to fetch accident')
    }
    setDataLoading(false)
  }

  const center = () => {
    const totalCount = 1
    let latSum = 0
    let lngSum = 0

    latSum += data.cctv.location.latitude
    lngSum += data.cctv.location.longitude

    const lat = latSum / totalCount
    const lng = lngSum / totalCount

    return { lat, lng }
  }

  if (dataLoading)
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center animate-fade-in'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4'></div>
          <p className='text-neutral-600 font-medium'>Loading accident details...</p>
        </div>
      </div>
    )

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='animate-fade-in'>
        <h1 className='text-4xl font-bold text-neutral-900 mb-2'>Accident Details</h1>
        <p className='text-neutral-600'>Review and manage accident severity classification</p>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        
        {/* Left Column - Image */}
        <div className='lg:col-span-2 space-y-6 animate-slide-in'>
          <div className='card p-6'>
            <h2 className='text-xl font-bold text-neutral-900 mb-4'>Accident Photo</h2>
            <div className='relative w-full aspect-video rounded-xl overflow-hidden border-2 border-neutral-200 shadow-lg'>
              <Image
                src={`/../${data?.photos}`}
                alt='Accident scene'
                fill
                className='object-cover'
                priority
              />
            </div>
          </div>

          {/* Map */}
          <div className='card p-6'>
            <h2 className='text-xl font-bold text-neutral-900 mb-4'>Location Map</h2>
            {data && (
              <Suspense fallback={
                <div className='h-96 bg-neutral-100 rounded-xl flex items-center justify-center'>
                  <div className='text-neutral-500'>Loading map...</div>
                </div>
              }>
                <div className='rounded-xl overflow-hidden border-2 border-neutral-200'>
                  <GoogleMapComponent
                    height='400px'
                    width='100%'
                    markers={[markers]}
                    zoom={15}
                    center={center()}
                  />
                </div>
              </Suspense>
            )}
          </div>
        </div>

        {/* Right Column - Info & Actions */}
        <div className='lg:col-span-1 space-y-6 animate-slide-in' style={{animationDelay: '100ms'}}>
          
          {/* Info Card */}
          <div className='card p-6'>
            <h2 className='text-xl font-bold text-neutral-900 mb-4'>Information</h2>
            <div className='space-y-4'>
              
              {/* Location */}
              <div className='flex items-start gap-3 p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200'>
                <div className='w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FiMapPin className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium text-red-600 mb-1'>Location</div>
                  <div className='font-semibold text-neutral-900 truncate'>{data?.cctv?.city}</div>
                </div>
              </div>

              {/* Time */}
              <div className='flex items-start gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200'>
                <div className='w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <BiTime className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium text-success-600 mb-1'>Date & Time</div>
                  <div className='font-semibold text-neutral-900 text-sm'>
                    {dayjs(data?.createdAt).format('DD MMM YYYY')}
                  </div>
                  <div className='text-sm text-neutral-600'>
                    {dayjs(data?.createdAt).format('hh:mm A')}
                  </div>
                </div>
              </div>

              {/* Camera */}
              <div className='flex items-start gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200'>
                <div className='w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <AiOutlineCamera className='w-5 h-5 text-white' />
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='text-xs font-medium text-primary-600 mb-1'>CCTV Camera</div>
                  <a 
                    href={data?.cctv?.ipAddress}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-primary-600 hover:text-primary-700 text-sm truncate block hover:underline'
                  >
                    {data?.cctv?.ipAddress}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Severity Form */}
          <div className='card p-6'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <h2 className='text-xl font-bold text-neutral-900 mb-1'>Severity Classification</h2>
                <p className='text-sm text-neutral-600 mb-4'>Select the appropriate severity level</p>
                
                <div className='space-y-3'>
                  {options?.map((option) => (
                    <button
                      key={option.id}
                      type='button'
                      onClick={() => setSeverity(option.label)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        option.label === severity
                          ? `${option.color} border-transparent text-white shadow-md scale-[1.02]`
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='font-semibold'>{option.label}</span>
                        {option.label === severity && (
                          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-sm text-red-700 font-medium'>{error}</p>
                </div>
              )}

              <button
                type='submit'
                disabled={loading}
                className='btn-primary w-full flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                    <span>Update Severity</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccidentDetailsPage
