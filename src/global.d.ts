
export {}

declare global {
  type QuarterKey = 'quarter1' | 'quarter2' | 'quarter3' | 'quarter4'

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

  interface UpdateGradeArgs {
    studentId: number
    subject: string
    quarter: 1 | 2 | 3 | 4
    grade: number | null
  }

  interface StudentGradesData {
    student_id: number
    first_name: string
    last_name: string
    grades: Grade[]
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
      }) => Promise<Grade[]>

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
