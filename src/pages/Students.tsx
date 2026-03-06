import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.tsx'
import './Students.css'

interface Student {
  id: number
  last_name: string
  first_name: string
}

interface Grade {
  subject: string
  quarter1: number | null
  quarter2: number | null
  quarter3: number | null
  quarter4: number | null
}

export default function Students() {
  const { gradeYear } = useParams<{ gradeYear: string }>()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentGrades, setStudentGrades] = useState<Grade[]>([])
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // const [generalAverage, setGeneralAverage] = useState<number>()

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
    setUnsavedChanges(false)
    const grades = await window.api.getStudentGrades({ studentId: student.id, gradeId: `grade_${gradeYear}` })
    setStudentGrades(grades)
  }

  const calculateAverage = (grade: Grade): number => {
    const grades = [grade.quarter1, grade.quarter2, grade.quarter3, grade.quarter4].filter(
      (g) => g !== null
    )
    if (grades.length === 0) return 0
    return Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10
  }

  const calculateGeneralAverage = (): number => {
    if (studentGrades.length === 0) return 0

    const subjectAverages = studentGrades
      .map((grade) => calculateAverage(grade))
      .filter((avg) => avg > 0)

    if (subjectAverages.length === 0) return 0

    return (
      Math.round(
        (subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length) * 10
      ) / 10
    )
  }

  const handleGradeChange = (subjectIndex: number, quarter: string, value: string) => {
    const newGrades = [...studentGrades]
    const numValue = value === '' ? null : parseInt(value)
    
    newGrades[subjectIndex] = {
      ...newGrades[subjectIndex],
      [quarter]: numValue,
    }
    
    setStudentGrades(newGrades)
    setUnsavedChanges(true)
  }

  const saveGrade = async (subjectIndex: number, quarter: string) => {
    if (!selectedStudent) return
    
    try {
      await window.api.updateStudentGrade({
        studentId: selectedStudent.id,
        subjectIndex,
        quarter,
        value: studentGrades[subjectIndex][quarter as keyof Grade],
        gradeId: `grade_${gradeYear}`,
      })
      setUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save grade:', error)
      alert('Failed to save grade')
    } finally {
      setEditingCell(null)
    }
  }


  const handleCellBlur = (subjectIndex: number, quarter: string) => {
    // Auto-save on blur (instant save on edit)
    saveGrade(subjectIndex, quarter)
  }

  const handleKeyDown = (e: React.KeyboardEvent, subjectIndex: number, quarter: string) => {
    if (e.key === 'Enter') {
      saveGrade(subjectIndex, quarter)
    } else if (e.key === 'Escape') {
      setEditingCell(null)
    }
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
          {selectedStudent ? (
            <div className="grades-main-content">
              <div className="grades-header">
                <h2>
                  {selectedStudent.last_name}, {selectedStudent.first_name}
                </h2>
                {unsavedChanges && (
                  <div className="unsaved-indicator">
                    <span className="dot"></span> Unsaved changes
                  </div>
                )}
              </div>

              <div className="grades-table-wrapper">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Q1</th>
                      <th>Q2</th>
                      <th>Q3</th>
                      <th>Q4</th>
                      <th>Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map((grade, idx) => (
                      <tr key={idx}>
                        <td className="subject-cell">{grade.subject}</td>
                        {['quarter1', 'quarter2', 'quarter3', 'quarter4'].map((quarter) => {
                          const cellId = `${idx}-${quarter}`
                          const isEditing = editingCell === cellId
                          const value = grade[quarter as keyof Grade]

                          return (
                            <td
                              key={quarter}
                              className="grade-cell"
                              onClick={() => setEditingCell(cellId)}
                            >
                              {isEditing ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  autoFocus
                                  value={value ?? ''}
                                  onChange={(e) =>
                                    handleGradeChange(idx, quarter, e.target.value)
                                  }
                                  onBlur={() => handleCellBlur(idx, quarter)}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, idx, quarter)
                                  }
                                  className="grade-input"
                                />
                              ) : (
                                <span className={value === null ? 'null-grade' : ''}>
                                  {value ?? '-'}
                                </span>
                              )}
                            </td>
                          )
                        })}
                        <td className="average">{calculateAverage(grade)}</td>
                      </tr>
                      // <div className="general-average">General Avg. {generalAverage(grade)}</div>
                    ))}
                  </tbody>
                </table>
                <div className="general-average">
                  <strong>General Average:</strong> {calculateGeneralAverage()}
                </div>

              </div>

              <div className="grades-footer">
                <p className="hint">Click any cell to edit • Press Enter to save • Esc to cancel</p>
              </div>
            </div>
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
