import React from 'react'
import { getAllCctv } from '@/helpers/cctvHelper'
import CctvMonitorGrid from '../components/CctvMonitorGrid'

const CctvPage = async () => {
  const cctvs = await getAllCctv()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">CCTV Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time video feeds with AI detection</p>
        </div>
        <div className="bg-white shadow rounded-lg px-6 py-4">
          <div className="text-sm text-gray-600">Active Cameras</div>
          <div className="text-3xl font-bold text-blue-600">
            {cctvs.filter(c => c.status).length} / {cctvs.length}
          </div>
        </div>
      </div>

      <CctvMonitorGrid cctvs={cctvs} />
    </div>
  )
}

export default CctvPage
