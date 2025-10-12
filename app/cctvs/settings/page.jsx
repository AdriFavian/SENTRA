import React from 'react'
import { getAllCctv } from '@/helpers/cctvHelper'
import Link from 'next/link'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import TelegramSettingsManager from './TelegramSettingsManager'

const SettingsPage = async () => {
  const cctvs = await getAllCctv()
  
return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
        <div className="max-w-[1400px] mx-auto p-6 lg:p-8 space-y-8">
            
            {/* Page Header */}
            <header className="animate-fade-in">
                <Link 
                    href="/cctvs"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Camera Network
                </Link>
                
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                            Notification Settings
                        </h1>
                        <p className="text-neutral-600 text-lg">
                            Configure Telegram alerts for accident detection
                        </p>
                    </div>
                    
                    {/* Info Box */}
                    <div className="card px-5 py-4 max-w-md bg-blue-50 border-blue-200">
                        <div className="flex items-start gap-3">
                            <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <div className="font-semibold mb-1">How it works</div>
                                <div className="text-blue-700">
                                    Each camera can have multiple Telegram contacts. When an accident is detected, 
                                    all contacts for that camera will receive instant notifications with photos and details.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Settings Content */}
            <section className="animate-slide-in">
                <TelegramSettingsManager cctvs={cctvs} />
            </section>

            {/* Help Section */}
            <div className="card p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">📱 Getting Your Telegram Chat ID</h3>
                <div className="space-y-3 text-sm text-neutral-700">
                    <div className="flex items-start gap-3">
                        <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                            1
                        </div>
                        <div>
                            <div className="font-semibold mb-1">Open Telegram and search for:</div>
                            <div className="flex items-center gap-2 mt-1">
                                <code className="bg-white px-2 py-1 rounded border border-violet-200">@Sentra_message_bot</code>
                                <span className="text-neutral-500">or click</span>
                                <a 
                                    href="http://t.me/Sentra_message_bot" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-violet-600 hover:text-violet-700 underline font-medium"
                                >
                                    t.me/Sentra_message_bot
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                            2
                        </div>
                        <div>
                            <div className="font-semibold mb-1">Send the command:</div>
                            <code className="bg-white px-2 py-1 rounded border border-violet-200">/start</code>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                            3
                        </div>
                        <div>
                            <div className="font-semibold mb-1">Copy your Chat ID from the response</div>
                            <div className="text-neutral-600 text-xs mt-1">
                                Example: <code className="bg-white px-1.5 py-0.5 rounded border border-violet-200">1234567890</code>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-semibold text-xs">
                            4
                        </div>
                        <div>
                            <div className="font-semibold mb-1">Paste it in the Chat ID field below</div>
                            <div className="text-neutral-600 text-xs mt-1">
                                Make sure to also start a chat with our bot: <code className="bg-white px-1.5 py-0.5 rounded border border-violet-200">@Sentra_message_bot</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default SettingsPage
