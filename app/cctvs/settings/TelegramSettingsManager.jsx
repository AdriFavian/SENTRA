'use client'

import { useState } from 'react'
import { FiPlus, FiTrash2, FiSend, FiCheckCircle } from 'react-icons/fi'
import { BiCctv } from 'react-icons/bi'

export default function TelegramSettingsManager({ cctvs }) {
  const [selectedCctv, setSelectedCctv] = useState(cctvs[0]?._id || null)
  const [contacts, setContacts] = useState({})
  const [loading, setLoading] = useState({})
  const [testingContact, setTestingContact] = useState(null)

  // Get selected CCTV details
  const currentCctv = cctvs.find(c => c._id === selectedCctv)

  // Load contacts for a specific CCTV
  const loadContacts = async (cctvId) => {
    try {
      const response = await fetch(`/api/telegram/cctv/${cctvId}`)
      if (response.ok) {
        const data = await response.json()
        setContacts(prev => ({ ...prev, [cctvId]: data }))
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  // Load contacts when CCTV is selected
  const handleCctvSelect = async (cctvId) => {
    setSelectedCctv(cctvId)
    if (!contacts[cctvId]) {
      await loadContacts(cctvId)
    }
  }

  // Add new contact
  const handleAddContact = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const chatId = formData.get('chatId')
    const name = formData.get('name')
    const phoneNumber = formData.get('phoneNumber')

    setLoading(prev => ({ ...prev, add: true }))

    try {
      const response = await fetch(`/api/telegram/cctv/${selectedCctv}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, name, phoneNumber })
      })

      if (response.ok) {
        await loadContacts(selectedCctv)
        e.target.reset()
        alert('✅ Contact added successfully!')
      } else {
        const error = await response.json()
        alert(`❌ Error: ${error.error || 'Failed to add contact'}`)
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      alert('❌ Failed to add contact')
    } finally {
      setLoading(prev => ({ ...prev, add: false }))
    }
  }

  // Remove contact
  const handleRemoveContact = async (contactId) => {
    if (!confirm('Are you sure you want to remove this contact?')) return

    setLoading(prev => ({ ...prev, [contactId]: true }))

    try {
      const response = await fetch(`/api/telegram/contact/${contactId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadContacts(selectedCctv)
        alert('✅ Contact removed successfully!')
      } else {
        const error = await response.json()
        alert(`❌ Failed to remove contact: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error removing contact:', error)
      alert('❌ Failed to remove contact. Check console for details.')
    } finally {
      setLoading(prev => ({ ...prev, [contactId]: false }))
    }
  }

  // Test notification
  const handleTestNotification = async (contactId) => {
    setTestingContact(contactId)

    try {
      const response = await fetch(`/api/telegram/test/${contactId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        alert('✅ Test notification sent! Check Telegram.')
      } else {
        const error = await response.json()
        alert(`❌ Failed to send test notification: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error sending test:', error)
      alert('❌ Failed to send test notification. Check console for details.')
    } finally {
      setTestingContact(null)
    }
  }

  const currentContacts = contacts[selectedCctv] || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* CCTV List */}
      <div className="lg:col-span-1">
        <div className="card p-5">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">Select Camera</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {cctvs.map(cctv => (
              <button
                key={cctv._id}
                onClick={() => handleCctvSelect(cctv._id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedCctv === cctv._id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <BiCctv className={`w-5 h-5 mt-0.5 ${
                    selectedCctv === cctv._id ? 'text-primary-600' : 'text-neutral-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-neutral-900 truncate">
                      {cctv.city}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                      {cctv.ipAddress}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        cctv.status
                          ? 'bg-success-100 text-success-700'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {cctv.status ? 'Active' : 'Offline'}
                      </span>

                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts Management */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Add Contact Form */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Add Telegram Contact for {currentCctv?.city}
          </h3>
          
          <form onSubmit={handleAddContact} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Chat ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="chatId"
                  placeholder="1234567890"
                  required
                  className="input-base"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Get from @Sentra_message_bot on Telegram
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  className="input-base"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+62812345678"
                  className="input-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading.add}
              className="btn-primary w-full md:w-auto flex items-center justify-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              {loading.add ? 'Adding...' : 'Add Contact'}
            </button>
          </form>
        </div>

        {/* Contacts List */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-900">
              Active Contacts ({currentContacts.length})
            </h3>
          </div>

          {currentContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-2">
                <FiCheckCircle className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-neutral-600 font-medium">No contacts added yet</p>
              <p className="text-sm text-neutral-500 mt-1">
                Add a contact above to receive notifications
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentContacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">
                      {contact.name}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">
                      Chat ID: <code className="bg-white px-2 py-0.5 rounded border border-neutral-200">
                        {contact.chatId}
                      </code>
                    </div>
                    {contact.phoneNumber && (
                      <div className="text-xs text-neutral-500 mt-1">
                        📞 {contact.phoneNumber}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestNotification(contact.id)}
                      disabled={testingContact === contact.id}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <FiSend className="w-4 h-4" />
                      {testingContact === contact.id ? 'Sending...' : 'Test'}
                    </button>

                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      disabled={loading[contact.id]}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
