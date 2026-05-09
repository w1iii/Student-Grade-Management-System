
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  gradeYear?: string | null
  isStudents?: boolean
}

export default function Navbar({ gradeYear, isStudents }: NavbarProps){
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleReturn = () => {
    navigate('/dashboard')
  }

  return(
  <>
      <div className="navbar-container">
        {isStudents ? <img id="logo" src="logo.png" alt="TCS logo" width="70px"/>: <p className="return" onClick={handleReturn}> return </p>}
        {gradeYear !== null ? <h2> Grade {gradeYear} </h2> : <h2>Student Grade Management </h2>}
        <p className="logout-btn" onClick={logout}> Logout </p>
      </div>
  </>
  )
}
