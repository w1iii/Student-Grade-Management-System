
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'
import Navbar from '../components/Navbar'

interface Grade {
  id: string
  label: string
}

export default function Dashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const navigate = useNavigate()

  const grades: Record<string, Grade[]> = {
    elementary: [
      { id: 'grade_1', label: 'Grade 1' },
      { id: 'grade_2', label: 'Grade 2' },
      { id: 'grade_3', label: 'Grade 3' },
      { id: 'grade_4', label: 'Grade 4' },
      { id: 'grade_5', label: 'Grade 5' },
      { id: 'grade_6', label: 'Grade 6' },
    ],
    highschool: [
      { id: 'grade_7', label: 'Grade 7' },
      { id: 'grade_8', label: 'Grade 8' },
      { id: 'grade_9', label: 'Grade 9' },
      { id: 'grade_10', label: 'Grade 10' },
    ],
    seniorhs: [
      { id: 'grade_11', label: 'Grade 11' },
      { id: 'grade_12', label: 'Grade 12' },
    ],
  }

  const handleGradeClick = (gradeId: string) => {
    setSelectedGrade(gradeId)

    // extract number from "grade_10" → 10
    const gradeNumber = gradeId.split('_')[1]

    // navigate(`/students/${gradeNumber}`)
    navigate('/report')
  }

  const renderSection = (title: string, gradeList: Grade[]) => (
    <div className="section">
      <h1>{title}</h1>
      <ul className="section-list">
        {gradeList.map((grade) => (
          <li
            key={grade.id}
            onClick={() => handleGradeClick(grade.id)}
            className={`grade-item ${
              selectedGrade === grade.id ? 'active' : ''
            }`}
          >
            {grade.label}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      <Navbar gradeYear={null} isStudents={true}/>
      <div className="dashboard-main-container">
        <div className="dashboard-container">
          {renderSection('Elementary', grades.elementary)}
          {renderSection('High School', grades.highschool)}
          {renderSection('Senior HS', grades.seniorhs)}
        </div>
      </div>
    </>
  )
}
