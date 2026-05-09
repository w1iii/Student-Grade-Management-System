import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login(){
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [invalidCredentials, setInvalidCredentials] = useState(false)

  const handleLogin = async () => {
    const success = await login(username, password)
    if (!success) {
      setInvalidCredentials(true)
    }
  }


  return(
    <>
      <div className="login-modal-container">
      <div className="login-container">
        <h1> Admin </h1>
        <div className="login-input">
          <input id="username" type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input id="password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button onClick={handleLogin}>
            Submit
          </button>
          { invalidCredentials && <p className="error-login">Invalid Credentials </p>}
        </div>
        </div>
      </div>
    </>
  )
}
