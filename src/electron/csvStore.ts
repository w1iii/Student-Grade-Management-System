import fs from 'fs-extra'
import path from 'path'

interface Grade {
  subject: string
  quarter1: number
  quarter2: number
  quarter3: number
  quarter4: number
}

interface StudentGradesData {
  student_id: number
  first_name: string
  last_name: string
  grades: Grade[]
}

const CSV_PATH = path.join(__dirname, '..', 'studentData.csv')

function parseCSV(content: string): StudentGradesData[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const studentsMap: Record<number, StudentGradesData> = {}

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const [studentId, firstName, lastName, subject, q1, q2, q3, q4] = line.split(',')
    const id = parseInt(studentId)

    if (!studentsMap[id]) {
      studentsMap[id] = {
        student_id: id,
        first_name: firstName,
        last_name: lastName,
        grades: []
      }
    }

    studentsMap[id].grades.push({
      subject: subject,
      quarter1: parseInt(q1) || 0,
      quarter2: parseInt(q2) || 0,
      quarter3: parseInt(q3) || 0,
      quarter4: parseInt(q4) || 0
    })
  }

  return Object.values(studentsMap)
}

function toCSV(students: StudentGradesData[]): string {
  let csvContent = 'student_id,first_name,last_name,subject,quarter1,quarter2,quarter3,quarter4\n'

  for (const student of students) {
    for (const grade of student.grades) {
      csvContent += `${student.student_id},${student.first_name},${student.last_name},${grade.subject},${grade.quarter1},${grade.quarter2},${grade.quarter3},${grade.quarter4}\n`
    }
  }

  return csvContent
}

export async function loadAllStudentsFromCSV(): Promise<StudentGradesData[]> {
  if (!await fs.pathExists(CSV_PATH)) {
    return []
  }
  const content = await fs.readFile(CSV_PATH, 'utf-8')
  return parseCSV(content)
}

export async function saveAllStudentsToCSV(students: StudentGradesData[]): Promise<void> {
  const csvContent = toCSV(students)
  await fs.writeFile(CSV_PATH, csvContent, 'utf-8')
}

export async function updateStudentGrade(
  studentId: number,
  subject: string,
  quarter: 'quarter1' | 'quarter2' | 'quarter3' | 'quarter4',
  value: number
): Promise<boolean> {
  const students = await loadAllStudentsFromCSV()
  const student = students.find(s => s.student_id === studentId)
  
  if (!student) return false

  const grade = student.grades.find(g => g.subject === subject)
  if (!grade) return false

  grade[quarter] = value

  await saveAllStudentsToCSV(students)
  return true
}

export async function updateAllStudentGrades(
  studentId: number,
  newGrades: Grade[]
): Promise<boolean> {
  const students = await loadAllStudentsFromCSV()
  const student = students.find(s => s.student_id === studentId)
  
  if (!student) return false

  student.grades = newGrades

  await saveAllStudentsToCSV(students)
  return true
}

export async function addStudent(
  firstName: string,
  lastName: string,
  grades: Grade[]
): Promise<number> {
  const students = await loadAllStudentsFromCSV()
  const newId = students.length > 0 
    ? Math.max(...students.map(s => s.student_id)) + 1 
    : 1

  students.push({
    student_id: newId,
    first_name: firstName,
    last_name: lastName,
    grades
  })

  await saveAllStudentsToCSV(students)
  return newId
}
