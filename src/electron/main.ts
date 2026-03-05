import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs-extra'

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

function getCSVPath(gradeLevel: string): string {
  return path.join(__dirname, '..', 'students', `grade_${gradeLevel.replace('grade_', '')}.csv`)
}

async function loadStudentsFromGrade(gradeLevel: string): Promise<StudentGradesData[]> {
  const csvPath = getCSVPath(gradeLevel)
  
  if (!await fs.pathExists(csvPath)) {
    return []
  }
  
  const content = await fs.readFile(csvPath, 'utf-8')
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

  const students = Object.values(studentsMap)
  
  students.sort((a, b) => {
    const lastNameCompare = a.last_name.localeCompare(b.last_name)
    if (lastNameCompare !== 0) return lastNameCompare
    return a.first_name.localeCompare(b.first_name)
  })

  return students
}

async function saveStudentsToGrade(gradeLevel: string, students: StudentGradesData[]): Promise<void> {
  const csvPath = getCSVPath(gradeLevel)
  
  let csvContent = 'student_id,first_name,last_name,subject,quarter1,quarter2,quarter3,quarter4\n'

  for (const student of students) {
    for (const grade of student.grades) {
      csvContent += `${student.student_id},${student.first_name},${student.last_name},${grade.subject},${grade.quarter1},${grade.quarter2},${grade.quarter3},${grade.quarter4}\n`
    }
  }

  await fs.writeFile(csvPath, csvContent, 'utf-8')
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  })
  win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)

ipcMain.handle('login', async (_, credentials: { username: string; password: string }) => {
  const { username, password } = credentials
  if (username === 'admin' && password === '1234') {
    return true 
  } else {
    return false
  }
})

ipcMain.handle('getStudents', async (_, { gradeId }) => {
  const gradeLevel = gradeId.replace('grade_', '')
  const students = await loadStudentsFromGrade(gradeLevel)
  return students.map(student => ({
    id: student.student_id,
    first_name: student.first_name,
    last_name: student.last_name
  }))
})

ipcMain.handle('getStudentGrades', async (_, { studentId, gradeId }) => {
  const gradeLevel = gradeId.replace('grade_', '')
  const students = await loadStudentsFromGrade(gradeLevel)
  const student = students.find(s => s.student_id === studentId)
  if (student) {
    return student.grades
  }
  return []
})

ipcMain.handle(
  'updateAllStudentGrades',
  async (_, { studentId, grades, gradeId }) => {
    const gradeLevel = gradeId.replace('grade_', '')
    const students = await loadStudentsFromGrade(gradeLevel)
    const student = students.find(s => s.student_id === studentId)
    
    if (!student) return false
    
    student.grades = grades
    await saveStudentsToGrade(gradeLevel, students)
    return true
  }
)

ipcMain.handle(
  'updateStudentGrade',
  async (_, { studentId, subjectIndex, quarter, value, gradeId }) => {
    const gradeLevel = gradeId.replace('grade_', '')
    const students = await loadStudentsFromGrade(gradeLevel)
    const student = students.find(s => s.student_id === studentId)
    
    if (!student || !student.grades[subjectIndex]) {
      return false
    }

    const subject = student.grades[subjectIndex].subject
    
    const quarterMap: Record<string, 'quarter1' | 'quarter2' | 'quarter3' | 'quarter4'> = {
      quarter1: 'quarter1',
      quarter2: 'quarter2',
      quarter3: 'quarter3',
      quarter4: 'quarter4'
    }
    
    const quarterKey = quarterMap[quarter]
    if (!quarterKey || value === null) {
      return false
    }
    
    student.grades[subjectIndex][quarterKey] = value as number
    await saveStudentsToGrade(gradeLevel, students)
    return true
  }
)
