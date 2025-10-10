'use client'

import { useEffect, useState } from 'react'
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

export default function AccidentStatistics({ initialStats, weeklyData }) {
  const [stats, setStats] = useState(initialStats)
  const [period, setPeriod] = useState('daily')
  const [loading, setLoading] = useState(false)

  const fetchStats = async (selectedPeriod) => {
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
  }

  useEffect(() => {
    fetchStats(period)
  }, [period])

  // Weekly accidents data (Monday-Sunday)
  const weeklyAccidentsData = {
    labels: weeklyData?.map(d => d.day) || [],
    datasets: [
      {
        label: 'Accidents',
        data: weeklyData?.map(d => d.count) || [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  const severityData = {
    labels: stats?.severity?.map(s => s.severity) || [],
    datasets: [
      {
        label: 'Accidents by Severity',
        data: stats?.severity?.map(s => parseInt(s.count)) || [],
        backgroundColor: [
          'rgba(220, 38, 38, 0.85)', // Fatal - red
          'rgba(251, 146, 60, 0.85)', // Serious - orange
          'rgba(34, 197, 94, 0.85)', // Normal - green
        ],
        borderColor: [
          'rgba(220, 38, 38, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const timeDistributionData = {
    labels: stats?.timeDistribution?.map(t => t.label) || [],
    datasets: [
      {
        label: 'Accidents',
        data: stats?.timeDistribution?.map(t => t.count) || [],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  const trendData = {
    labels: stats?.trend?.map(t => {
      const date = new Date(t.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }) || [],
    datasets: [
      {
        label: 'Daily Accidents',
        data: stats?.trend?.map(t => t.count) || [],
        fill: true,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      },
    ],
  }

  const topLocationsData = {
    labels: stats?.topLocations?.slice(0, 5).map(l => l.city || l.ipAddress) || [],
    datasets: [
      {
        label: 'Accidents',
        data: stats?.topLocations?.slice(0, 5).map(l => l.count) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.85)',
          'rgba(249, 115, 22, 0.85)',
          'rgba(234, 179, 8, 0.85)',
          'rgba(34, 197, 94, 0.85)',
          'rgba(59, 130, 246, 0.85)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        }
      }
    },
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Analytics Overview</h2>
        <div className="flex gap-2 items-center">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="daily">Last 24 Hours</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
          
          <button
            onClick={() => fetchStats(period)}
            disabled={loading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            title="Refresh data"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Accidents (Monday-Sunday) */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Accidents by Day</h3>
            <p className="text-xs text-gray-500 mt-1">Weekly distribution (Sun - Sat)</p>
          </div>
          <div className="h-64">
            <Bar data={weeklyAccidentsData} options={chartOptions} />
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Severity Distribution</h3>
            <p className="text-xs text-gray-500 mt-1">Classification breakdown</p>
          </div>
          <div className="h-64">
            <Pie data={severityData} options={pieOptions} />
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">Top Locations</h3>
            <p className="text-xs text-gray-500 mt-1">High-risk areas</p>
          </div>
          <div className="h-64">
            <Bar data={topLocationsData} options={chartOptions} />
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              {period === 'daily' ? 'Hourly Distribution' : 'Time Distribution'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {period === 'daily' ? 'Last 24 hours' : `Last ${period === 'weekly' ? '7' : '30'} days`}
            </p>
          </div>
          <div className="h-64">
            <Bar data={timeDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Trend Line - Full Width */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">30-Day Trend</h3>
            <p className="text-xs text-gray-500 mt-1">Historical accident pattern</p>
          </div>
          <div className="h-72">
            <Line data={trendData} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: { display: false }}}} />
          </div>
        </div>
      </div>

      {/* Top Locations Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Accident Hotspots</h3>
          <p className="text-xs text-gray-500 mt-1">Top 10 locations with most incidents</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Accidents
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {stats?.topLocations?.slice(0, 10).map((location, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {location.city || 'Unknown'}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {location.ipAddress}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
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
