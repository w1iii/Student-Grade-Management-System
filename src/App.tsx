import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Students from './pages/Students.tsx'
import ProgressReport from './pages/ProgressReport.tsx'
import Settings from './pages/Settings.tsx'

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/report" element={<ProtectedRoute><ProgressReport /></ProtectedRoute>}/>
          <Route path="/students/:gradeYear" element={<ProtectedRoute><Students/></ProtectedRoute>}/>
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
