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

  const analyticsData = [
    {
      id: 1,
      name: 'Cities Covered',
      number: new Set(cctvLists?.map(c => c.city)).size || 0,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      icon: '🌆'
    },
    {
      id: 2,
      name: 'Active CCTVs',
      number: cctvLists?.filter(c => c.status).length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      icon: '📹'
    },
    {
      id: 3,
      name: 'Total Accidents',
      number: accidents?.length || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      icon: '🚨'
    },
    {
      id: 4,
      name: 'Fatal Accidents',
      number: accidents?.filter(a => a.accidentClassification === 'Fatal').length || 0,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      icon: '⚠️'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">SENTRA Dashboard</h1>
        <p className="text-blue-100 text-lg">
          Smart Emergency Network for Traffic & Road Accident Detection
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map(({ id, name, number, color, bgColor, icon }) => (
          <div key={id} className={`${bgColor} shadow-md rounded-lg overflow-hidden`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{icon}</span>
                <div className={`text-4xl font-bold ${color}`}>
                  {number}
                </div>
              </div>
              <h3 className="text-gray-700 font-semibold text-lg">{name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Statistics and Alerts */}
        <div className="xl:col-span-2 space-y-8">
          {/* Statistics Dashboard */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <AccidentStatistics initialStats={stats} />
          </div>

          {/* CCTV Lists */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">CCTV Management</h2>
            <CctvLists cctvLists={cctvLists} />
          </div>
        </div>

        {/* Right Column - Real-time Alerts */}
        <div className="xl:col-span-1">
          <div className="bg-white shadow-lg rounded-lg p-6 sticky top-6">
            <RealtimeAlerts />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-600">AI Detection</p>
                <p className="font-semibold text-gray-800">Active</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-600">Socket.IO Server</p>
                <p className="font-semibold text-gray-800">Connected</p>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm text-gray-600">Database</p>
                <p className="font-semibold text-gray-800">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
