import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import ReportCard from '../components/ReportCard.tsx'
import './Students.css'

export default function Students() {
  const { gradeYear } = useParams<{ gradeYear: string }>()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentData, setStudentData] = useState<StudentGradesData | null>(null)
  const [editingCell, setEditingCell] = useState<string | null>(null)

  useEffect(() => {
    if (!gradeYear) return
    const fetchStudents = async () => {
      const res = await window.api.getStudents({
        gradeId: `grade_${gradeYear}`,
      })
      setStudents(res)
    }
    fetchStudents()
  }, [gradeYear])

  const handleStudentClick = async (student: Student) => {
    setSelectedStudent(student)
    setEditingCell(null)
    const data = await window.api.getStudentGrades({ studentId: student.id, gradeId: `grade_${gradeYear}` })
    setStudentData(data)
  }

  const handleGradeChange = (subjectIndex: number, quarter: string, value: string) => {
    if (!studentData) return
    const newGrades = [...studentData.grades]
    const numValue = value === '' ? null : parseInt(value)
    
    newGrades[subjectIndex] = {
      ...newGrades[subjectIndex],
      [quarter]: numValue,
    }
    
    setStudentData({ ...studentData, grades: newGrades })
  }

  const saveGrade = async (subjectIndex: number, quarter: string) => {
    if (!selectedStudent || !studentData) return
    
    try {
      await window.api.updateStudentGrade({
        studentId: selectedStudent.id,
        subjectIndex,
        quarter,
        value: studentData.grades[subjectIndex][quarter as keyof Grade] as number | null,
        gradeId: `grade_${gradeYear}`,
      })
    } catch (error) {
      console.error('Failed to save grade:', error)
      alert('Failed to save grade')
    } finally {
      setEditingCell(null)
    }
  }

  const handleCellClick = (cellId: string) => {
    setEditingCell(cellId)
  }

  const handleCellBlur = (subjectIndex: number, quarter: string) => {
    saveGrade(subjectIndex, quarter)
  }

  const getGradeLevelName = (): string => {
    if (!gradeYear) return ''
    const num = parseInt(gradeYear)
    if (num >= 1 && num <= 6) return `Grade ${num}`
    if (num === 7) return '1st Year'
    if (num === 8) return '2nd Year'
    if (num === 9) return '3rd Year'
    if (num === 10) return '4th Year'
    if (num === 11) return '1st Year (Senior High)'
    if (num === 12) return '2nd Year (Senior High)'
    return `Grade ${num}`
  }

  return (
    <>
      <Navbar gradeYear={gradeYear} />
      <div className="students-container">
        <div className="students-sidebar">
          <div className="searchbar-container">
            <input className="searchbar" type="text" />
            <button>search</button>
          </div>
          <div className="students-content">
            <div className="student-list">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleStudentClick(student)}
                  className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                >
                  {student.last_name}, {student.first_name}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grades-container">
          {selectedStudent && studentData ? (
            <ReportCard
              studentInfo={{
                LRN: studentData.LRN || '',
                first_name: studentData.first_name || selectedStudent.first_name,
                last_name: studentData.last_name || selectedStudent.last_name,
                adviser: studentData.adviser || '',
                section: studentData.section || '',
                sy: studentData.sy || '',
                gradeLevel: getGradeLevelName(),
              }}
              grades={studentData.grades}
              traits={studentData.traits}
              attendance={studentData.attendance}
              onGradeChange={handleGradeChange}
              onCellBlur={handleCellBlur}
              editingCell={editingCell}
              onCellClick={handleCellClick}
            />
          ) : (
            <div className="empty-state">
              <p>Select a student to view grades</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
