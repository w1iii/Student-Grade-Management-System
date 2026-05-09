import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.tsx'
import './Settings.css'

export default function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // School info
  const [schoolName, setSchoolName] = useState('')
  const [schoolAcronym, setSchoolAcronym] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [depEdRecognition, setDepEdRecognition] = useState('')
  const [accreditation, setAccreditation] = useState('')
  const [principalName, setPrincipalName] = useState('')
  const [depEdForm, setDepEdForm] = useState('')

  // Password
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const config = await window.api.getSettings()
        setSchoolName(config.schoolName)
        setSchoolAcronym(config.schoolAcronym)
        setSchoolAddress(config.schoolAddress)
        setDepEdRecognition(config.depEdRecognition)
        setAccreditation(config.accreditation)
        setPrincipalName(config.principalName)
        setDepEdForm(config.depEdForm)
      } catch {
        setError('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSaveInfo = async () => {
    setError('')
    setSaved(false)
    try {
      await window.api.saveSettings({
        schoolName,
        schoolAcronym,
        schoolAddress,
        depEdRecognition,
        accreditation,
        principalName,
        depEdForm,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to save settings')
    }
  }

  const handleChangePassword = async () => {
    setPasswordMessage('')
    if (!currentPassword) {
      setPasswordMessage('Enter current password')
      return
    }
    if (!newPassword) {
      setPasswordMessage('Enter new password')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match')
      return
    }
    if (newPassword.length < 4) {
      setPasswordMessage('Password must be at least 4 characters')
      return
    }
    try {
      const result = await window.api.changePassword({ currentPassword, newPassword })
      if (result.success) {
        setPasswordMessage('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMessage(result.error || 'Failed to change password')
      }
    } catch {
      setPasswordMessage('Failed to change password')
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  const handleExportCSV = async () => {
    try {
      const result = await window.api.exportAllGrades()
      if (result) {
        alert('Grades exported to students/exported_grades.csv')
      } else {
        alert('No grade data to export')
      }
    } catch {
      alert('Failed to export grades')
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="settings-page">
          <p className="settings-loading">Loading settings...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="settings-page">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>

          {/* School Info */}
          <section className="settings-section">
            <h2>School Information</h2>
            {error && <p className="settings-error">{error}</p>}
            {saved && <p className="settings-success">Settings saved</p>}

            <div className="settings-field">
              <label>School Name</label>
              <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>School Acronym</label>
              <input type="text" value={schoolAcronym} onChange={(e) => setSchoolAcronym(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>School Address</label>
              <input type="text" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>DepEd Recognition</label>
              <input type="text" value={depEdRecognition} onChange={(e) => setDepEdRecognition(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>Accreditation</label>
              <input type="text" value={accreditation} onChange={(e) => setAccreditation(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>Principal Name</label>
              <input type="text" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>DepEd Form Label</label>
              <input type="text" value={depEdForm} onChange={(e) => setDepEdForm(e.target.value)} />
            </div>
            <button className="settings-btn" onClick={handleSaveInfo}>Save School Info</button>
          </section>

          {/* Change Password */}
          <section className="settings-section">
            <h2>Change Password</h2>
            {passwordMessage && (
              <p className={passwordMessage.includes('success') ? 'settings-success' : 'settings-error'}>
                {passwordMessage}
              </p>
            )}
            <div className="settings-field">
              <label>Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="settings-field">
              <label>Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className="settings-btn" onClick={handleChangePassword}>Change Password</button>
          </section>

          {/* Export */}
          <section className="settings-section">
            <h2>Export Data</h2>
            <div className="settings-export-buttons">
              <button className="settings-btn" onClick={handleExportPDF}>Export Report as PDF</button>
              <button className="settings-btn" onClick={handleExportCSV}>Export All Grades as CSV</button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
