'use client'

import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { FiRefreshCw } from 'react-icons/fi'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Memoized Chart Component for better performance
const ChartWrapper = memo(({ type: ChartType, data, options }) => {
  return <ChartType data={data} options={options} />
})
ChartWrapper.displayName = 'ChartWrapper'

function AccidentStatistics({ initialStats, weeklyData }) {
  const [stats, setStats] = useState(initialStats)
  const [period, setPeriod] = useState('daily')
  const [loading, setLoading] = useState(false)

  const fetchStats = useCallback(async (selectedPeriod) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/stats?period=${selectedPeriod}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats(period)
  }, [period, fetchStats])

  // Memoized chart data to prevent unnecessary re-renders
  const weeklyAccidentsData = useMemo(() => ({
    labels: weeklyData?.map(d => d.day.slice(0, 3)) || [],
    datasets: [
      {
        label: 'Accidents',
        data: weeklyData?.map(d => d.count) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.9)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 0,
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  }), [weeklyData])

  const severityData = useMemo(() => ({
    labels: stats?.severity?.map(s => s.severity) || [],
    datasets: [
      {
        label: 'By Severity',
        data: stats?.severity?.map(s => parseInt(s.count)) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.9)',
          'rgba(249, 115, 22, 0.9)',
          'rgba(34, 197, 94, 0.9)',
        ],
        borderColor: ['#ef4444', '#f97316', '#22c55e'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }), [stats?.severity])

  const timeDistributionData = useMemo(() => ({
    labels: stats?.timeDistribution?.map(t => t.label) || [],
    datasets: [
      {
        label: 'Incidents',
        data: stats?.timeDistribution?.map(t => t.count) || [],
        backgroundColor: 'rgba(14, 165, 233, 0.9)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 0,
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  }), [stats?.timeDistribution])

  const trendData = useMemo(() => ({
    labels: stats?.trend?.map(t => {
      const date = new Date(t.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }) || [],
    datasets: [
      {
        label: 'Daily Trend',
        data: stats?.trend?.map(t => t.count) || [],
        fill: true,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx
          const gradient = ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)')
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
          return gradient
        },
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(99, 102, 241)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  }), [stats?.trend])

  const topLocationsData = useMemo(() => ({
    labels: stats?.topLocations?.slice(0, 5).map(l => l.city || l.ipAddress.slice(0, 15)) || [],
    datasets: [
      {
        label: 'Incidents',
        data: stats?.topLocations?.slice(0, 5).map(l => l.count) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.9)',
          'rgba(249, 115, 22, 0.9)',
          'rgba(234, 179, 8, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(59, 130, 246, 0.9)',
        ],
        borderColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
        borderWidth: 0,
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  }), [stats?.topLocations])

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 14,
        cornerRadius: 10,
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 13 },
        titleColor: '#fff',
        bodyColor: '#e5e5e5',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: { size: 11, family: 'Poppins' },
          color: '#737373',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        }
      },
      x: {
        ticks: {
          font: { size: 11, family: 'Poppins' },
          color: '#737373',
        },
        grid: {
          display: false,
          drawBorder: false,
        }
      }
    }
  }), [])

  const pieOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 18,
          font: { size: 12, family: 'Poppins', weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#404040',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 14,
        cornerRadius: 10,
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
  }), [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Analytics Overview</h2>
          <p className="text-sm text-neutral-500 mt-1">Track incidents and patterns</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input-base text-sm py-2 pr-8"
          >
            <option value="daily">Last 24 Hours</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
          
          <button
            onClick={() => fetchStats(period)}
            disabled={loading}
            className="btn-secondary p-2.5"
            title="Refresh data"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Accidents */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-neutral-900">Weekly Distribution</h3>
            <p className="text-xs text-neutral-500 mt-1">Incidents by day of week</p>
          </div>
          <div className="h-64">
            <ChartWrapper type={Bar} data={weeklyAccidentsData} options={chartOptions} />
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-neutral-900">Severity Classification</h3>
            <p className="text-xs text-neutral-500 mt-1">Risk level breakdown</p>
          </div>
          <div className="h-64">
            <ChartWrapper type={Pie} data={severityData} options={pieOptions} />
          </div>
        </div>

        {/* Top Locations */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-neutral-900">Hotspot Locations</h3>
            <p className="text-xs text-neutral-500 mt-1">High-risk areas</p>
          </div>
          <div className="h-64">
            <ChartWrapper type={Bar} data={topLocationsData} options={chartOptions} />
          </div>
        </div>

        {/* Time Distribution */}
        <div className="card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-neutral-900">
              {period === 'daily' ? 'Hourly Pattern' : 'Time Distribution'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">When incidents occur</p>
          </div>
          <div className="h-64">
            <ChartWrapper type={Bar} data={timeDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Trend Line - Full Width */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-neutral-900">30-Day Trend Analysis</h3>
            <p className="text-xs text-neutral-500 mt-1">Historical incident pattern</p>
          </div>
          <div className="h-80">
            <ChartWrapper type={Line} data={trendData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Locations Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="text-lg font-semibold text-neutral-900">Detailed Hotspot Analysis</h3>
          <p className="text-xs text-neutral-500 mt-1">Top 10 locations by incident count</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Camera ID
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  Total Incidents
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {stats?.topLocations?.slice(0, 10).map((location, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm
                      ${index === 0 ? 'bg-red-100 text-red-700' : 
                        index === 1 ? 'bg-orange-100 text-orange-700' :
                        index === 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-neutral-100 text-neutral-700'}`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">
                    {location.city || 'Unknown Location'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-600 font-mono bg-neutral-50 rounded">
                    {location.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg bg-red-100 text-red-700">
                      {location.count} {location.count === 1 ? 'incident' : 'incidents'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default memo(AccidentStatistics)
