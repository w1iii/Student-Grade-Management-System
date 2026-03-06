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

interface Trait {
  trait: string
  quarter1: number
  quarter2: number
  quarter3: number
  quarter4: number
}

interface Attendance {
  month: string
  daysOfSchool: number
  daysPresent: number
  daysTardy: number
}

interface StudentData {
  student_id: number
  LRN: string
  first_name: string
  last_name: string
  adviser: string
  section: string
  sy: string
  grades: Grade[]
  traits: Trait[]
  attendance: Attendance[]
}

function getCSVPath(gradeLevel: string): string {
  return path.join(__dirname, '..', 'students', `grade_${gradeLevel.replace('grade_', '')}.csv`)
}

function getTraitsCSVPath(gradeLevel: string): string {
  return path.join(__dirname, '..', 'students', `grade_${gradeLevel.replace('grade_', '')}_traits.csv`)
}

function getAttendanceCSVPath(gradeLevel: string): string {
  return path.join(__dirname, '..', 'students', `grade_${gradeLevel.replace('grade_', '')}_attendance.csv`)
}

async function loadStudentsFromGrade(gradeLevel: string): Promise<StudentData[]> {
  const csvPath = getCSVPath(gradeLevel)
  const traitsPath = getTraitsCSVPath(gradeLevel)
  const attendancePath = getAttendanceCSVPath(gradeLevel)
  
  if (!await fs.pathExists(csvPath)) {
    return []
  }
  
  const content = await fs.readFile(csvPath, 'utf-8')
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const studentsMap: Record<number, StudentData> = {}

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const parts = line.split(',')
    const [studentId, LRN, firstName, lastName, adviser, section, sy, subject, q1, q2, q3, q4] = parts
    const id = parseInt(studentId)

    if (!studentsMap[id]) {
      studentsMap[id] = {
        student_id: id,
        LRN: LRN || '',
        first_name: firstName,
        last_name: lastName,
        adviser: adviser || '',
        section: section || '',
        sy: sy || '',
        grades: [],
        traits: [],
        attendance: []
      }
    }

    if (subject) {
      studentsMap[id].grades.push({
        subject: subject,
        quarter1: parseInt(q1) || 0,
        quarter2: parseInt(q2) || 0,
        quarter3: parseInt(q3) || 0,
        quarter4: parseInt(q4) || 0
      })
    }
  }

  if (await fs.pathExists(traitsPath)) {
    const traitsContent = await fs.readFile(traitsPath, 'utf-8')
    const traitsLines = traitsContent.trim().split('\n')
    const defaultTraitNames = [
      'Care for environment',
      'Consideration for others',
      'Creativity',
      'Helpfulness and cooperation',
      'Honesty and integrity',
      'Physical well-being',
      'Respect for authority and others',
      'Self-discipline & Sense of responsibility',
      'Punctuality',
      'Wise use of things'
    ]
    for (let i = 1; i < traitsLines.length; i++) {
      const line = traitsLines[i].trim()
      if (!line) continue
      const parts = line.split(',')
      if (parts.length < 6) continue
      const studentId = parts[0]
      const trait = parts[1]
      const q1 = parts[2]
      const q2 = parts[3]
      const q3 = parts[4]
      const q4 = parts[5]
      const id = parseInt(studentId)
      const traitIndex = i - 1
      if (!isNaN(id) && studentsMap[id]) {
        studentsMap[id].traits.push({
          trait: trait || defaultTraitNames[traitIndex] || '',
          quarter1: parseInt(q1) || 0,
          quarter2: parseInt(q2) || 0,
          quarter3: parseInt(q3) || 0,
          quarter4: parseInt(q4) || 0
        })
      }
    }
  }

  if (await fs.pathExists(attendancePath)) {
    const attendanceContent = await fs.readFile(attendancePath, 'utf-8')
    const attendanceLines = attendanceContent.trim().split('\n')
    for (let i = 1; i < attendanceLines.length; i++) {
      const line = attendanceLines[i].trim()
      if (!line) continue
      const parts = line.split(',')
      if (parts.length < 5) continue
      const studentId = parts[0]
      const month = parts[1]
      const daysOfSchool = parts[2]
      const daysPresent = parts[3]
      const daysTardy = parts[4]
      const id = parseInt(studentId)
      if (!isNaN(id) && studentsMap[id]) {
        studentsMap[id].attendance.push({
          month: month,
          daysOfSchool: parseInt(daysOfSchool) || 0,
          daysPresent: parseInt(daysPresent) || 0,
          daysTardy: parseInt(daysTardy) || 0
        })
      }
    }
  }

  const students = Object.values(studentsMap)
  
  students.sort((a, b) => {
    const lastNameCompare = a.last_name.localeCompare(b.last_name)
    if (lastNameCompare !== 0) return lastNameCompare
    return a.first_name.localeCompare(b.first_name)
  })

  return students
}

async function saveStudentsToGrade(gradeLevel: string, students: StudentData[]): Promise<void> {
  const csvPath = getCSVPath(gradeLevel)
  const traitsPath = getTraitsCSVPath(gradeLevel)
  const attendancePath = getAttendanceCSVPath(gradeLevel)
  
  let csvContent = 'student_id,LRN,first_name,last_name,adviser,section,sy,subject,q1,q2,q3,q4\n'

  for (const student of students) {
    for (const grade of student.grades) {
      csvContent += `${student.student_id},${student.LRN},${student.first_name},${student.last_name},${student.adviser},${student.section},${student.sy},${grade.subject},${grade.quarter1},${grade.quarter2},${grade.quarter3},${grade.quarter4}\n`
    }
  }

  await fs.writeFile(csvPath, csvContent, 'utf-8')

  let traitsContent = 'student_id,trait,q1,q2,q3,q4\n'
  const defaultTraitNames = [
    'Care for environment',
    'Consideration for others',
    'Creativity',
    'Helpfulness and cooperation',
    'Honesty and integrity',
    'Physical well-being',
    'Respect for authority and others',
    'Self-discipline & Sense of responsibility',
    'Punctuality',
    'Wise use of things'
  ]
  for (const student of students) {
    if (student.traits && student.traits.length > 0) {
      for (let i = 0; i < student.traits.length; i++) {
        const trait = student.traits[i]
        const traitName = trait.trait || defaultTraitNames[i] || ''
        traitsContent += `${student.student_id},${traitName},${trait.quarter1},${trait.quarter2},${trait.quarter3},${trait.quarter4}\n`
      }
    }
  }
  await fs.writeFile(traitsPath, traitsContent, 'utf-8')

  let attendanceContent = 'student_id,month,daysOfSchool,daysPresent,daysTardy\n'
  const defaultMonths = ['Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  for (const student of students) {
    if (student.attendance && student.attendance.length > 0) {
      for (let i = 0; i < student.attendance.length; i++) {
        const att = student.attendance[i]
        const monthName = att.month || defaultMonths[i] || ''
        attendanceContent += `${student.student_id},${monthName},${att.daysOfSchool},${att.daysPresent},${att.daysTardy}\n`
      }
    }
  }
  await fs.writeFile(attendancePath, attendanceContent, 'utf-8')
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
    LRN: student.LRN,
    first_name: student.first_name,
    last_name: student.last_name,
    adviser: student.adviser,
    section: student.section,
    sy: student.sy
  }))
})

ipcMain.handle('getStudentGrades', async (_, { studentId, gradeId }) => {
  const gradeLevel = gradeId.replace('grade_', '')
  const students = await loadStudentsFromGrade(gradeLevel)
  const student = students.find(s => s.student_id === studentId)
  if (student) {
    return {
      grades: student.grades,
      traits: student.traits,
      attendance: student.attendance,
      LRN: student.LRN,
      adviser: student.adviser,
      section: student.section,
      sy: student.sy,
      first_name: student.first_name,
      last_name: student.last_name
    }
  }
  return null
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

ipcMain.handle(
  'updateStudentTrait',
  async (_, { studentId, traitIndex, quarter, value, gradeId }) => {
    console.log('updateStudentTrait called:', { studentId, traitIndex, quarter, value, gradeId })
    const gradeLevel = gradeId.replace('grade_', '')
    const students = await loadStudentsFromGrade(gradeLevel)
    const student = students.find(s => s.student_id === studentId)
    
    console.log('Found student:', student?.student_id)
    
    if (!student) {
      console.error('Student not found')
      return false
    }
    
    if (!student.traits) {
      student.traits = []
    }
    
    while (student.traits.length <= traitIndex) {
      student.traits.push({
        trait: '',
        quarter1: 0,
        quarter2: 0,
        quarter3: 0,
        quarter4: 0
      })
    }
    
    const quarterMap: Record<string, 'quarter1' | 'quarter2' | 'quarter3' | 'quarter4'> = {
      quarter1: 'quarter1',
      quarter2: 'quarter2',
      quarter3: 'quarter3',
      quarter4: 'quarter4'
    }
    
    const quarterKey = quarterMap[quarter]
    if (!quarterKey) {
      console.error('Invalid quarter:', quarter)
      return false
    }
    
    student.traits[traitIndex][quarterKey] = value as number
    await saveStudentsToGrade(gradeLevel, students)
    console.log('Trait saved successfully')
    return true
  }
)

ipcMain.handle(
  'updateStudentAttendance',
  async (_, { studentId, monthIndex, field, value, gradeId }) => {
    console.log('updateStudentAttendance called:', { studentId, monthIndex, field, value, gradeId })
    const gradeLevel = gradeId.replace('grade_', '')
    const students = await loadStudentsFromGrade(gradeLevel)
    const student = students.find(s => s.student_id === studentId)
    
    console.log('Found student:', student?.student_id)
    
    if (!student) {
      console.error('Student not found')
      return false
    }
    
    if (!student.attendance) {
      student.attendance = []
    }
    
    while (student.attendance.length <= monthIndex) {
      student.attendance.push({
        month: '',
        daysOfSchool: 0,
        daysPresent: 0,
        daysTardy: 0
      })
    }
    
    if (field === 'daysOfSchool') {
      student.attendance[monthIndex].daysOfSchool = value as number
    } else if (field === 'daysPresent') {
      student.attendance[monthIndex].daysPresent = value as number
    } else if (field === 'daysTardy') {
      student.attendance[monthIndex].daysTardy = value as number
    } else {
      console.error('Invalid field:', field)
      return false
    }
    
    await saveStudentsToGrade(gradeLevel, students)
    console.log('Attendance saved successfully')
    return true
  }
)
