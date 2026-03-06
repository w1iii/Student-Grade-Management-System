import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  login: (credentials: {username: string, password: string}) => ipcRenderer.invoke('login', credentials),
  getStudents: (data: {gradeId: string}) => ipcRenderer.invoke('getStudents', data),
  getStudentGrades: (data: {studentId: number, gradeId: string}) => ipcRenderer.invoke('getStudentGrades', data),
  updateAllStudentGrades: (data: {studentId: number, grades: any[], gradeId: string}) => ipcRenderer.invoke('updateAllStudentGrades', data),
  updateStudentGrade: (data: {studentId: number, subjectIndex: number, quarter: string, value: number | null, gradeId: string}) => ipcRenderer.invoke('updateStudentGrade', data),
  updateStudentTrait: (data: {studentId: number, traitIndex: number, quarter: string, value: number, gradeId: string}) => ipcRenderer.invoke('updateStudentTrait', data),
  updateStudentAttendance: (data: {studentId: number, monthIndex: number, field: string, value: number, gradeId: string}) => ipcRenderer.invoke('updateStudentAttendance', data)
})
