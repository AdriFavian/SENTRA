import { getAllCctv } from '@/helpers/cctvHelper'
import { getAllAccidents } from '@/helpers/accidentHelper'
import AccidentStatistics from './components/AccidentStatistics'
import RealtimeAlerts from './components/RealtimeAlerts'
import CctvLists from './components/CctvLists'

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stats?period=daily`, {
      cache: 'no-store'
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error fetching stats:', error)
    return null
  }
}

export default async function Home() {
  const cctvLists = await getAllCctv()
  const accidents = await getAllAccidents()
  const stats = await getStats()

  // Calculate accidents by day of week
  const accidentsByDay = accidents?.reduce((acc, accident) => {
    const day = new Date(accident.createdAt).getDay()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {}) || {}

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const weeklyData = dayNames.map((day, index) => ({
    day,
    count: accidentsByDay[index] || 0
  }))

  const analyticsData = [
    {
      id: 1,
      name: 'Cities Covered',
      number: new Set(cctvLists?.map(c => c.city)).size || 0,
      color: 'text-indigo-600',
      bgColor: 'bg-white',
      borderColor: 'border-indigo-200',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Active CCTVs',
      number: cctvLists?.filter(c => c.status).length || 0,
      color: 'text-blue-600',
      bgColor: 'bg-white',
      borderColor: 'border-blue-200',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Total Accidents',
      number: accidents?.length || 0,
      color: 'text-amber-600',
      bgColor: 'bg-white',
      borderColor: 'border-amber-200',
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Fatal Accidents',
      number: accidents?.filter(a => a.accidentClassification === 'Fatal').length || 0,
      color: 'text-red-600',
      bgColor: 'bg-white',
      borderColor: 'border-red-200',
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">SENTRA Dashboard</h1>
              <p className="text-gray-600">
                Smart Emergency Network for Traffic & Road Accident Detection
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">System Online</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.map(({ id, name, number, color, bgColor, borderColor, icon }) => (
            <div key={id} className={`${bgColor} border ${borderColor} rounded-xl p-5 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{name}</p>
                  <p className={`text-3xl font-bold ${color}`}>{number}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  {icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Statistics */}
          <div className="xl:col-span-2 space-y-6">
            {/* Statistics Dashboard */}
            <AccidentStatistics initialStats={stats} weeklyData={weeklyData} />

            {/* CCTV Lists */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">CCTV Management</h2>
                <span className="text-sm text-gray-500">
                  {cctvLists?.filter(c => c.status).length || 0} / {cctvLists?.length || 0} Active
                </span>
              </div>
              <CctvLists cctvLists={cctvLists} />
            </div>
          </div>

          {/* Right Column - Real-time Alerts & System Status */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
              <RealtimeAlerts />
            </div>

            {/* System Status */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">AI Detection</span>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Socket Server</span>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">Connected</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Database</span>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
