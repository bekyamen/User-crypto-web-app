'use client'

import { useState, useRef, useEffect } from "react"
import { Bell } from "lucide-react"

interface NotificationDropdownProps {
  // optional: can leave empty if you always want "No notifications"
}

export default function NotificationDropdown(props: NotificationDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [ref])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-white relative"
      >
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-4 text-white font-semibold border-b border-slate-700">Notifications</div>
          <ul className="max-h-64 overflow-y-auto">
            <li className="px-4 py-4 text-center text-slate-400">No notifications</li>
          </ul>
        </div>
      )}
    </div>
  )
}
