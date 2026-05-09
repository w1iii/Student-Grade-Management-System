import { useParams } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '../components/Navbar.tsx'
import ReportCard from '../components/ReportCard.tsx'
import './Students.css'

export default function Students() {
  const { gradeYear } = useParams<{ gradeYear: string }>()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentData, setStudentData] = useState<StudentGradesData | null>(null)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [isLoadingGrades, setIsLoadingGrades] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig | null>(null)

  useEffect(() => {
    if (!gradeYear) return
    const fetchStudents = async () => {
      setIsLoadingStudents(true)
      try {
        const [studentsRes, settings] = await Promise.all([
          window.api.getStudents({ gradeId: `grade_${gradeYear}` }),
          window.api.getSettings(),
        ])
        setStudents(studentsRes)
        setSchoolConfig(settings)
      } catch (error) {
        console.error('Failed to load students:', error)
      } finally {
        setIsLoadingStudents(false)
      }
    }
    fetchStudents()
  }, [gradeYear])

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase()
    return students.filter(
      s => s.last_name.toLowerCase().includes(q) || s.first_name.toLowerCase().includes(q)
    )
  }, [students, searchQuery])

  const handleStudentClick = async (student: Student) => {
    setSelectedStudent(student)
    setEditingCell(null)
    setIsLoadingGrades(true)
    try {
      const data = await window.api.getStudentGrades({ studentId: student.id, gradeId: `grade_${gradeYear}` })
      
      const defaultTraits = [
      { trait: 'Care for environment', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Consideration for others', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Creativity', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Helpfulness and cooperation', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Honesty and integrity', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Physical well-being', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Respect for authority and others', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Self-discipline & Sense of responsibility', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Punctuality', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
      { trait: 'Wise use of things', quarter1: 0, quarter2: 0, quarter3: 0, quarter4: 0 },
    ]
    
    const defaultAttendance = [
      { month: 'Jun', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Jul', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Aug', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Sept', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Oct', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Nov', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Dec', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Jan', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Feb', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
      { month: 'Mar', daysOfSchool: 0, daysPresent: 0, daysTardy: 0 },
    ]
    
    setStudentData({
      ...data,
      traits: data.traits && data.traits.length > 0 ? data.traits : defaultTraits,
      attendance: data.attendance && data.attendance.length > 0 ? data.attendance : defaultAttendance,
    })
    } catch (error) {
      console.error('Failed to load grades:', error)
    } finally {
      setIsLoadingGrades(false)
    }
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

  const handleTraitChange = (traitIndex: number, quarter: string, value: string) => {
    if (!studentData) return
    const newTraits = studentData.traits ? [...studentData.traits] : []
    const numValue = value === '' ? 0 : parseInt(value)
    
    if (newTraits[traitIndex]) {
      newTraits[traitIndex] = {
        ...newTraits[traitIndex],
        [quarter]: numValue,
      }
    } else {
      newTraits[traitIndex] = {
        trait: '',
        quarter1: 0,
        quarter2: 0,
        quarter3: 0,
        quarter4: 0,
        [quarter]: numValue,
      }
    }
    
    setStudentData({ ...studentData, traits: newTraits })
  }

  const saveTrait = async (traitIndex: number, quarter: string) => {
    if (!selectedStudent || !studentData || !studentData.traits) return
    
    try {
      await window.api.updateStudentTrait({
        studentId: selectedStudent.id,
        traitIndex,
        quarter,
        value: studentData.traits[traitIndex]?.[quarter as keyof Trait] as number || 0,
        gradeId: `grade_${gradeYear}`,
      })
    } catch (error) {
      console.error('Failed to save trait:', error)
      alert('Failed to save trait')
    } finally {
      setEditingCell(null)
    }
  }

  const handleAttendanceChange = (monthIndex: number, field: string, value: string) => {
    if (!studentData) return
    const newAttendance = studentData.attendance ? [...studentData.attendance] : []
    const numValue = value === '' ? 0 : parseInt(value)
    
    if (newAttendance[monthIndex]) {
      newAttendance[monthIndex] = {
        ...newAttendance[monthIndex],
        [field]: numValue,
      }
    } else {
      newAttendance[monthIndex] = {
        month: '',
        daysOfSchool: 0,
        daysPresent: 0,
        daysTardy: 0,
        [field]: numValue,
      }
    }
    
    setStudentData({ ...studentData, attendance: newAttendance })
  }

  const saveAttendance = async (monthIndex: number, field: string) => {
    if (!selectedStudent || !studentData || !studentData.attendance) return
    
    try {
      await window.api.updateStudentAttendance({
        studentId: selectedStudent.id,
        monthIndex,
        field,
        value: studentData.attendance[monthIndex]?.[field as keyof Attendance] as number || 0,
        gradeId: `grade_${gradeYear}`,
      })
    } catch (error) {
      console.error('Failed to save attendance:', error)
      alert('Failed to save attendance')
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

  const handleTraitBlur = (traitIndex: number, quarter: string) => {
    saveTrait(traitIndex, quarter)
  }

  const handleAttendanceBlur = (monthIndex: number, field: string) => {
    saveAttendance(monthIndex, field)
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
            <input
              className="searchbar"
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setSearchQuery('')}>
              {searchQuery ? 'clear' : 'search'}
            </button>
          </div>
          <div className="students-content">
            {isLoadingStudents ? (
              <p className="loading-text">Loading students...</p>
            ) : filteredStudents.length === 0 ? (
              <p className="loading-text">
                {searchQuery ? 'No students match your search' : 'No students found'}
              </p>
            ) : (
              <div className="student-list">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
                    className={`student-item ${selectedStudent?.id === student.id ? 'active' : ''}`}
                  >
                    {student.last_name}, {student.first_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grades-container">
          {isLoadingGrades ? (
            <div className="empty-state">
              <p>Loading grades...</p>
            </div>
          ) : selectedStudent && studentData ? (
            <>
            <div className="report-toolbar">
              <button className="print-btn" onClick={() => window.print()} title="Print or save as PDF">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print / PDF
              </button>
            </div>
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
              schoolConfig={schoolConfig!}
              grades={studentData.grades}
              traits={studentData.traits}
              attendance={studentData.attendance}
              onGradeChange={handleGradeChange}
              onTraitChange={handleTraitChange}
              onAttendanceChange={handleAttendanceChange}
              onCellBlur={handleCellBlur}
              onTraitBlur={handleTraitBlur}
              onAttendanceBlur={handleAttendanceBlur}
              editingCell={editingCell}
              onCellClick={handleCellClick}
            />
            </>
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
