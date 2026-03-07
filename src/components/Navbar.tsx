
import './Navbar.css'
import { useNavigate } from 'react-router-dom'

export default function Navbar(props:any){
  const title = props.gradeYear
  const navigate = useNavigate()

  const handleReturn = () => {
    navigate('/dashboard')
  }

  const handleLogout = () =>{
    navigate('/')

  }
  return(
  <>
      <div className="navbar-container">
        {props.isStudents ? <img id="logo" src="logo.png" alt="TCS logo" width="70px"/>: <p className="return" onClick={handleReturn}> return </p>}
        {title !== null ? <h2> Grade {title} </h2> : <h2>Student Grade Management </h2>}
        <p className="logout-btn" onClick={handleLogout}> Logout </p>
      </div>
  </>
  )
}
