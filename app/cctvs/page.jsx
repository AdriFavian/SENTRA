import React from 'react'
import { getAllCctv } from '@/helpers/cctvHelper'
import CctvMonitorGrid from '../components/CctvMonitorGrid'
import Link from 'next/link'
import { FiSettings } from 'react-icons/fi'

const CctvPage = async () => {
  const cctvs = await getAllCctv()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="max-w-[1800px] mx-auto p-6 lg:p-8 space-y-8">
        
        {/* Page Header */}
        <header className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                Camera Network
              </h1>
              <p className="text-neutral-600 text-lg">
                Monitor live feeds with AI-powered accident detection
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Active Cameras Stats */}
              <div className="card px-6 py-4 min-w-[160px]">
                <div className="text-sm font-medium text-neutral-600 mb-1">Active Cameras</div>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                    {cctvs.filter(c => c.status).length}
                  </div>
                  <div className="text-neutral-400 text-xl font-semibold">
                    / {cctvs.length}
                  </div>
                </div>
              </div>

              {/* Telegram Settings Button */}
              <Link 
                href="/cctvs/settings"
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <FiSettings className="w-5 h-5" />
                <span>Notification Settings</span>
              </Link>
            </div>
          </div>
        </header>

        {/* CCTV Monitor Grid */}
        <section className="animate-slide-in">
          <CctvMonitorGrid cctvs={cctvs} />
        </section>
      </div>
    </div>
  )
}

export default CctvPage
