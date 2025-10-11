'use client'

import { useState } from 'react'
import { FaWhatsapp, FaPlus, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function WhatsAppContactsManager({ cctvId, initialContacts = [] }) {
  const [contacts, setContacts] = useState(initialContacts)
  const [isAdding, setIsAdding] = useState(false)
  const [newContact, setNewContact] = useState({ phoneNumber: '', name: '' })
  const [loading, setLoading] = useState(false)

  const handleAddContact = async (e) => {
    e.preventDefault()
    
    if (!newContact.phoneNumber) {
      toast.error('Nomor telepon diperlukan')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/whatsapp/cctv/${cctvId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact)
      })

      const data = await response.json()

      if (data.success) {
        setContacts([...contacts, data.contact])
        setNewContact({ phoneNumber: '', name: '' })
        setIsAdding(false)
        toast.success('Kontak berhasil ditambahkan')
      } else {
        toast.error(data.error || 'Gagal menambahkan kontak')
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveContact = async (contactId) => {
    if (!confirm('Hapus kontak ini?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/whatsapp/cctv/${cctvId}?contactId=${contactId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setContacts(contacts.filter(c => c.id !== contactId))
        toast.success('Kontak berhasil dihapus')
      } else {
        toast.error(data.error || 'Gagal menghapus kontak')
      }
    } catch (error) {
      console.error('Error removing contact:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaWhatsapp className="text-green-500 text-xl" />
          <h3 className="font-semibold text-gray-800">Kontak WhatsApp</h3>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {contacts.length}
          </span>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <FaPlus className="text-xs" />
            Tambah
          </button>
        )}
      </div>

      {/* Add Contact Form */}
      {isAdding && (
        <form onSubmit={handleAddContact} className="bg-gray-50 p-3 rounded-lg mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nomor WhatsApp (087858520937)"
              value={newContact.phoneNumber}
              onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Nama (opsional)"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewContact({ phoneNumber: '', name: '' })
              }}
              disabled={loading}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-2">
        {contacts.length === 0 && !isAdding && (
          <p className="text-gray-500 text-sm text-center py-4">
            Belum ada kontak WhatsApp
          </p>
        )}
        
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FaWhatsapp className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  {contact.name || 'Tanpa Nama'}
                </p>
                <p className="text-gray-600 text-xs">
                  +{contact.phoneNumber}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handleRemoveContact(contact.id)}
              disabled={loading}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-50"
              title="Hapus kontak"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      {contacts.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            💡 Semua kontak akan menerima notifikasi WhatsApp saat kecelakaan terdeteksi
          </p>
        </div>
      )}
    </div>
  )
}
