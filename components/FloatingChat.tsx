'use client'

import React, { useEffect, useState } from 'react'
import { MessageCircle, Send, AlertCircle } from 'lucide-react'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

type Contact = {
  id: string
  platform: string
  value: string
}


export default function FloatingChat() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------------- Fetch Contacts ----------------
  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${API_BASE_URL}/contacts`)

      if (!res.ok) {
        throw new Error(`Failed to fetch contacts: ${res.status}`)
      }

      const data = await res.json()
      const contactsArray = Array.isArray(data.data) ? data.data : [data.data]
      setContacts(contactsArray)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch contacts'
      console.error('[FloatingChat] Error:', msg)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  // ---------------- Get Contact Safely ----------------
  const getContactValue = (platform: 'telegram' | 'whatsapp') => {
    const contact = contacts.find(
      (c) => c.platform?.toLowerCase() === platform.toLowerCase()
    )
    return contact?.value?.trim() || ''
  }

  // ---------------- Generate Links ----------------
  const whatsappLink = (number: string) => {
    if (!number) return '#'
    const cleanNumber = number.replace(/\D/g, '')
    return `https://wa.me/${cleanNumber}`
  }

  const telegramLink = (username: string) => {
    if (!username) return '#'
    if (username.startsWith('http')) return username
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    return `https://t.me/${cleanUsername}`
  }

  const telegram = getContactValue('telegram')
  const whatsapp = getContactValue('whatsapp')

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3">
      {/* Error */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2 shadow-lg">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-slate-700 border border-slate-600 text-slate-200 px-4 py-3 rounded-lg text-sm shadow-lg">
          Loading contacts...
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappLink(whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition transform hover:scale-110 ${
          whatsapp
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-slate-600 pointer-events-none opacity-60'
        }`}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* Telegram Button */}
      <a
        href={telegramLink(telegram)}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition transform hover:scale-110 ${
          telegram
            ? 'bg-sky-500 hover:bg-sky-600'
            : 'bg-slate-600 pointer-events-none opacity-60'
        }`}
      >
        <Send className="w-7 h-7 text-white" />
      </a>
    </div>
  )
}
