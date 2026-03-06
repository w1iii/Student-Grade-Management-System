
export {}

declare global {
  type QuarterKey = 'quarter1' | 'quarter2' | 'quarter3' | 'quarter4'

  interface Student {
    id: number
    last_name: string
    first_name: string
    LRN?: string
    adviser?: string
    section?: string
    sy?: string
  }

  interface Grade {
    subject: string
    quarter1: number | null
    quarter2: number | null
    quarter3: number | null
    quarter4: number | null
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

  interface StudentGradesData {
    student_id: number
    first_name: string
    last_name: string
    LRN?: string
    adviser?: string
    section?: string
    sy?: string
    grades: Grade[]
    traits?: Trait[]
    attendance?: Attendance[]
  }

  interface Window {
    api: {
      login: (credentials: {
        username: string
        password: string
      }) => Promise<string>

      getStudents: (args: {
        gradeId: string
      }) => Promise<Student[]>

      getStudentGrades: (args: {
        studentId: number
        gradeId: string
      }) => Promise<StudentGradesData>

      updateAllStudentGrades: (args: {
        studentId: number
        grades: Grade[]
        gradeId: string
      }) => Promise<boolean>

      updateStudentGrade: (args: {
        studentId: number
        subjectIndex: number
        quarter: QuarterKey | string
        value: number | null
        gradeId: string
      }) => Promise<boolean>
    }
  }
}
