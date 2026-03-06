import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom"
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Students from './pages/Students.tsx'
import ProgressReport from './pages/ProgressReport.tsx'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/report" element={<ProgressReport />}/>
        <Route path="/students/:gradeYear" element={<Students/>}/>
      </Routes>
    </HashRouter>
  )
}

export default App
