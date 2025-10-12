import { getAllCctv } from '@/helpers/cctvHelper'
import { getAllAccidents } from '@/helpers/accidentHelper'
import AccidentStatistics from './components/AccidentStatistics'
import RealtimeAlerts from './components/RealtimeAlerts'

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
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 2,
      name: 'Active Cameras',
      number: cctvLists?.filter(c => c.status).length || 0,
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      name: 'Total Incidents',
      number: accidents?.length || 0,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      id: 4,
      name: 'Critical Alerts',
      number: accidents?.filter(a => a.accidentClassification === 'Fatal').length || 0,
      gradient: 'from-red-500 to-pink-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="max-w-[1800px] mx-auto p-6 lg:p-8 space-y-8">
        
        {/* Page Header */}
        <header className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                Welcome to SENTRA
              </h1>
              <p className="text-neutral-600 text-lg">
                Smart Emergency Network for Traffic & Road Analysis
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl shadow-sm">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-success-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-success-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-neutral-900">System Online</div>
                <div className="text-xs text-neutral-500">All services operational</div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-in">
          {analyticsData.map(({ id, name, number, gradient, icon, iconBg, iconColor }) => (
            <div 
              key={id} 
              className="group relative overflow-hidden bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-600 mb-3">{name}</p>
                  <p className={`text-4xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                    {number}
                  </p>
                </div>
                <div className={`${iconBg} ${iconColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
              </div>
              
              {/* Subtle bottom border gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Analytics */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Analytics Dashboard */}
            <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <AccidentStatistics initialStats={stats} weeklyData={weeklyData} />
            </section>
          </div>

          {/* Right Column - Real-time Alerts */}
          <div className="xl:col-span-1">
            <section className="sticky top-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="card p-6">
                <RealtimeAlerts />
              </div>

              {/* Quick System Status */}
              <div className="mt-6 card p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">System Health</h3>
                <div className="space-y-3">
                  <StatusIndicator 
                    label="AI Detection Engine" 
                    status="operational" 
                  />
                  <StatusIndicator 
                    label="Real-time Streaming" 
                    status="operational" 
                  />
                  <StatusIndicator 
                    label="Database Connection" 
                    status="operational" 
                  />
                  <StatusIndicator 
                    label="Notification Service" 
                    status="operational" 
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

// Memoized Status Indicator Component for better performance
function StatusIndicator({ label, status }) {
  const isOperational = status === 'operational'
  
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isOperational ? 'bg-success-500 animate-pulse' : 'bg-danger-500'}`}></div>
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded ${
        isOperational 
          ? 'bg-success-100 text-success-700' 
          : 'bg-danger-100 text-danger-700'
      }`}>
        {isOperational ? 'Active' : 'Down'}
      </span>
    </div>
  )
}
