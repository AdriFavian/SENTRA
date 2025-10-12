'use client'

import { useState, useEffect } from 'react'
import { FaTelegram, FaPlus, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function TelegramContactsManager({ cctvId }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    chatId: '',
    phoneNumber: '',
    name: ''
  })

  useEffect(() => {
    if (cctvId) {
      loadContacts()
    }
  }, [cctvId])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/telegram/cctv/${cctvId}`)
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
      toast.error('Gagal memuat kontak Telegram')
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = async (e) => {
    e.preventDefault()

    if (!formData.chatId) {
      toast.error('Chat ID wajib diisi')
      return
    }

    try {
      const response = await fetch(`/api/telegram/cctv/${cctvId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Kontak berhasil ditambahkan')
        setFormData({ chatId: '', phoneNumber: '', name: '' })
        setShowAddForm(false)
        loadContacts()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal menambahkan kontak')
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      toast.error('Gagal menambahkan kontak')
    }
  }

  const handleRemoveContact = async (contactId) => {
    if (!confirm('Yakin ingin menghapus kontak ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/telegram/cctv/${cctvId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contactId })
      })

      if (response.ok) {
        toast.success('Kontak berhasil dihapus')
        loadContacts()
      } else {
        toast.error('Gagal menghapus kontak')
      }
    } catch (error) {
      console.error('Error removing contact:', error)
      toast.error('Gagal menghapus kontak')
    }
  }

  if (!cctvId) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaTelegram className="text-blue-500 text-2xl" />
          <h3 className="text-lg font-semibold">Kontak Telegram</h3>
        </div>
        <p className="text-gray-500">Pilih CCTV untuk mengelola kontak Telegram</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaTelegram className="text-blue-500 text-2xl" />
          <h3 className="text-lg font-semibold">Kontak Telegram</h3>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaPlus />
          Tambah Kontak
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <form onSubmit={handleAddContact} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chat ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.chatId}
                onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                placeholder="123456789 atau @username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Gunakan @Sentra_message_bot untuk mendapatkan Chat ID
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="087866301810"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama kontak"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setFormData({ chatId: '', phoneNumber: '', name: '' })
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-2">Memuat kontak...</p>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-8">
          <FaTelegram className="text-gray-300 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">Belum ada kontak Telegram</p>
          <p className="text-sm text-gray-400 mt-1">
            Tambahkan kontak untuk menerima notifikasi kecelakaan
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaTelegram className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-900">
                    {contact.name || 'Kontak Telegram'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Chat ID: {contact.chatId}
                  </p>
                  {contact.phoneNumber && (
                    <p className="text-sm text-gray-500">
                      {contact.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus kontak"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">ℹ️ Cara Mendapatkan Chat ID:</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Buka Telegram dan cari bot <code className="bg-blue-100 px-1 rounded">@Sentra_message_bot</code></li>
          <li>Kirim pesan <code className="bg-blue-100 px-1 rounded">/start</code> ke bot</li>
          <li>Bot akan mengirimkan Chat ID Anda</li>
          <li>Salin Chat ID dan masukkan di form di atas</li>
        </ol>
        <p className="text-sm text-blue-800 mt-3">
          <strong>Penting:</strong> Pengguna harus memulai chat dengan bot SENTRA terlebih dahulu agar dapat menerima notifikasi.
        </p>
      </div>
    </div>
  )
}
