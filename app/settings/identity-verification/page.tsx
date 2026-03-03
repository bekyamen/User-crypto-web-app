'use client'

import { useState, useEffect } from 'react'
import { Shield, Upload } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type Verification = {
  id: string
  userId: string
  documentType: string
  fullName: string
  documentNumber: string
  frontSideUrl: string
  backSideUrl: string
  reviewedBy: string | null
  reviewNote: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

type Level2Verification = {
  id: string
  userId: string
  selfieUrl: string
  proofOfAddressUrl: string
  dateOfBirth: string
  country: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNote: string | null
  createdAt: string
  updatedAt: string
}



const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export default function IdentityVerificationPage() {
  const { token, isLoading: authLoading } = useAuth()
  const [verification, setVerification] = useState<Verification | null>(null)
  const [documentType, setDocumentType] = useState('passport')
  const [fullName, setFullName] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [frontSideFile, setFrontSideFile] = useState<File | null>(null)
  const [backSideFile, setBackSideFile] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)


  const [level2, setLevel2] = useState<Level2Verification | null>(null)
const [level2Loading, setLevel2Loading] = useState(false)
const [selfieFile, setSelfieFile] = useState<File | null>(null)
const [addressFile, setAddressFile] = useState<File | null>(null)
const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
const [dateOfBirth, setDateOfBirth] = useState('')
const [country, setCountry] = useState('')

  const documentTypes = [
    { id: 'identity-card', name: 'Identity Card' },
    { id: 'passport', name: 'Passport' },
    { id: 'driver-license', name: "Driver's License" },
  ]

  // =============================
  // Fetch existing verification
  // =============================
  const fetchVerification = async () => {
    if (!token) {
      setFetching(false)
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/identity-verification/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      let data
      try {
        data = await res.json()
      } catch (err) {
        console.error('Failed to parse JSON:', err)
        setVerification(null)
        return
      }

      if (!res.ok) {
        console.error('Server error:', data)
        setVerification(null)
        return
      }

      setVerification(data.verification)
      // Fetch Level 2
try {
  const res2 = await fetch(`${API_BASE_URL}/identity-verification/level2/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res2.ok) {
    const data2 = await res2.json()
    setLevel2(data2.verification)
  }
} catch (err) {
  console.error('Level 2 fetch error:', err)
}
    } catch (err: any) {
      console.error('Fetch verification error:', err.message)
      setVerification(null)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    if (!authLoading) fetchVerification()
  }, [token, authLoading])



  



  // =============================
  // Handle file selection
  // =============================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (side === 'front') {
        setFrontPreview(reader.result as string)
        setFrontSideFile(file)
      } else {
        setBackPreview(reader.result as string)
        setBackSideFile(file)
      }
    }
    reader.readAsDataURL(file)
  }

  // =============================
  // Submit verification
  // =============================
  const handleSubmit = async () => {
    if (!fullName || !documentNumber || !frontSideFile || !backSideFile || !token) {
      alert('Please fill all required fields and upload both documents')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullName', fullName)
      formData.append('documentNumber', documentNumber)
      formData.append('documentType', documentType.toUpperCase())
      formData.append('frontSide', frontSideFile)
      formData.append('backSide', backSideFile)

      const res = await fetch(`${API_BASE_URL}/identity-verification/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      let data
      try {
        data = await res.json()
      } catch (err) {
        alert('Server returned invalid response')
        return
      }

      if (!res.ok) {
        console.error('Submission error:', data)
        alert(data.message || 'Submission failed')
        return
      }

      setVerification(data.verification)
      alert('Verification submitted successfully!')

      // reset form
      setFullName('')
      setDocumentNumber('')
      setFrontSideFile(null)
      setBackSideFile(null)
      setFrontPreview(null)
      setBackPreview(null)
    } catch (err: any) {
      alert(err.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }


  const handleLevel2Submit = async () => {
  if (!selfieFile || !addressFile || !dateOfBirth || !country || !token) {
    alert('Please complete all Level 2 fields')
    return
  }

  setLevel2Loading(true)

  try {
    const formData = new FormData()
    formData.append('selfie', selfieFile)
    formData.append('proofOfAddress', addressFile)
    formData.append('dateOfBirth', dateOfBirth)
    formData.append('country', country)

    const res = await fetch(`${API_BASE_URL}/identity-verification/level2/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'Level 2 submission failed')
      return
    }

    setLevel2(data.verification)
    alert('Level 2 submitted successfully!')
  } catch (err: any) {
    alert(err.message || 'Submission failed')
  } finally {
    setLevel2Loading(false)
  }
}


  if (authLoading || fetching) return <p className="text-white text-center mt-10">Loading...</p>

  // =============================
  // Render
  // =============================
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Identity Verification</h1>

      {verification ? (
        verification.status === 'PENDING' ? (
          <div className="border border-yellow-500 rounded-lg p-6 bg-yellow-900/20 text-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-yellow-400" />
              <h2 className="text-lg font-semibold">Verification Pending</h2>
            </div>
            <p>Your identity verification is currently being reviewed. We'll notify you once it's complete (usually within 24-48 hours).</p>
            <p className="mt-2 font-semibold">Status: <span className="text-yellow-400">{verification.status}</span></p>
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-sm mb-1">Front Side</p>
                <img src={verification.frontSideUrl} className="w-32 h-32 object-cover rounded-md" />
              </div>
              <div>
                <p className="text-sm mb-1">Back Side</p>
                <img src={verification.backSideUrl} className="w-32 h-32 object-cover rounded-md" />
              </div>
            </div>
            {verification.reviewNote && <p className="mt-2 text-sm text-slate-300">Review Note: {verification.reviewNote}</p>}
          </div>
        ) : (
          <div className={`border rounded-lg p-6 ${verification.status === 'APPROVED' ? 'border-green-500 bg-green-900/20 text-green-200' : 'border-red-500 bg-red-900/20 text-red-200'}`}>
            <h2 className="text-lg font-semibold mb-2">Verification Completed</h2>
            <p>Status: <span className={verification.status === 'APPROVED' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{verification.status}</span></p>
            <p>Full Name: {verification.fullName}</p>
            <p>Document Number: {verification.documentNumber}</p>
            <p>Document Type: {verification.documentType}</p>
          </div>
        )
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-semibold">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
            >
              {documentTypes.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Document Number"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-full"
            />
          </div>

          <div className="mb-4 grid md:grid-cols-2 gap-4">
            {/* Front Side */}
            <label className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-6 h-6 mb-2 text-slate-400" />
              <span className="text-sm mb-2">Front Side</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'front')} />
              {frontPreview && <img src={frontPreview} className="mt-2 w-full h-32 object-cover rounded-md" />}
            </label>

            {/* Back Side */}
            <label className="border-2 border-dashed border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-6 h-6 mb-2 text-slate-400" />
              <span className="text-sm mb-2">Back Side</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'back')} />
              {backPreview && <img src={backPreview} className="mt-2 w-full h-32 object-cover rounded-md" />}
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-600 disabled:opacity-50 transition"
          >
            {loading ? 'Submitting...' : 'Submit Verification'}
          </button>
        </>
      )}

      {/* ================= LEVEL 2 ================= */}
{verification?.status === 'APPROVED' && (
  <div className="mt-14">
    <div className="flex items-center gap-3 mb-6">
      <Shield className="w-6 h-6 text-purple-400" />
      <h2 className="text-xl font-semibold">
        Level 2 – Advanced Verification
      </h2>
    </div>

    {level2 ? (
  <div className="border border-green-500 bg-green-900/20 text-green-200 rounded-lg p-8 text-center space-y-4">
    <div className="flex justify-center">
      <div className="bg-green-500/20 p-4 rounded-full">
        <Shield className="w-10 h-10 text-green-400" />
      </div>
    </div>

    <h3 className="text-2xl font-bold text-green-400">
      Level 2 Verification Submitted Successfully
    </h3>

    <p className="text-slate-300">
      Your advanced verification has been received successfully.
      Our team will review your documents if required.
    </p>

    <div className="text-sm text-slate-400">
      Submitted on {new Date(level2.createdAt).toLocaleDateString()}
    </div>
  </div>
) : (
      <div className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700">

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="border-2 border-dashed border-slate-700 rounded-lg p-4 cursor-pointer text-center">
            Upload Selfie
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setSelfieFile(file)
                setSelfiePreview(URL.createObjectURL(file))
              }}
            />
            {selfiePreview && (
              <img src={selfiePreview} className="mt-2 h-24 mx-auto rounded-md" />
            )}
          </label>

          <label className="border-2 border-dashed border-slate-700 rounded-lg p-4 cursor-pointer text-center">
            Upload Proof of Address
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setAddressFile(file)
              }}
            />
          </label>
        </div>

        <button
          onClick={handleLevel2Submit}
          disabled={level2Loading}
          className="w-full bg-purple-600 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {level2Loading ? 'Submitting...' : 'Submit Level 2'}
        </button>
      </div>
    )}
  </div>
)}

    </div>
  )
}