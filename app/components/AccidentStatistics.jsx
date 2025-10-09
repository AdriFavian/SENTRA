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

export default function AccidentStatistics({ initialStats }) {
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

  const severityData = {
    labels: stats?.severity?.map(s => s.severity) || [],
    datasets: [
      {
        label: 'Accidents by Severity',
        data: stats?.severity?.map(s => parseInt(s.count)) || [],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // Fatal - red
          'rgba(251, 146, 60, 0.8)', // Serious - orange
          'rgba(34, 197, 94, 0.8)', // Normal - green
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const timeDistributionData = {
    labels: stats?.timeDistribution?.map(t => t.label) || [],
    datasets: [
      {
        label: 'Accidents',
        data: stats?.timeDistribution?.map(t => t.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
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
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
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
          'rgba(244, 63, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Accidents</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.total || 0}</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Active CCTVs</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.cctvs?.active || 0}</p>
          <p className="text-xs text-gray-500 mt-1">of {stats?.cctvs?.total || 0} total</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
          <h3 className="text-gray-500 text-sm font-medium">Serious Accidents</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats?.severity?.find(s => s.severity === 'Serious')?.count || 0}
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-rose-600">
          <h3 className="text-gray-500 text-sm font-medium">Fatal Accidents</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {stats?.severity?.find(s => s.severity === 'Fatal')?.count || 0}
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Accident Analytics</h2>
        <div className="flex gap-2 items-center">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Last 24 Hours</option>
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
          
          <button
            onClick={() => fetchStats(period)}
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Severity Distribution</h3>
          <div className="h-64">
            <Pie data={severityData} options={pieOptions} />
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Accident Locations</h3>
          <div className="h-64">
            <Bar data={topLocationsData} options={chartOptions} />
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Time Distribution ({period === 'daily' ? 'Hourly' : period === 'weekly' ? 'Daily' : 'Daily'})
          </h3>
          <div className="h-64">
            <Bar data={timeDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Trend Line */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">30-Day Trend</h3>
          <div className="h-64">
            <Line data={trendData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Locations Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Accident Hotspots</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accidents
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.topLocations?.slice(0, 10).map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.city || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      {location.count}
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
