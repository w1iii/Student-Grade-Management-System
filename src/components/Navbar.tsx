
import './Navbar.css'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  gradeYear?: string | null
  isStudents?: boolean
}

export default function Navbar({ gradeYear, isStudents }: NavbarProps){
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleReturn = () => {
    navigate('/dashboard')
  }

  const handleLogout = () => {
    setIsDropdownOpen(false)
    logout()
  }

  return(
  <>
      <div className="navbar-container">
        {isStudents ? <img id="logo" src="logo.png" alt="TCS logo" width="70px"/>: <p className="return" onClick={handleReturn}> return </p>}
        {gradeYear !== null ? <h2> Grade {gradeYear} </h2> : <h2>Student Grade Management </h2>}
        <div className="user-menu" ref={dropdownRef}>
          <button className="user-icon-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)} title="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => { setIsDropdownOpen(false); navigate('/settings'); }}>
                Settings
              </button>
              <button className="dropdown-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
  </>
  )
}
