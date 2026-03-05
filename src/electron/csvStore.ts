import fs from 'fs-extra'
import path from 'path'
import csv from 'csv-parser'

interface Grade {
  subject: string
  quarter1: number
  quarter2: number
  quarter3: number
  quarter4: number
}

interface StudentGradesData {
  student_id: number
  name: string
  grade_level: number
  grades: Grade[]
}

export async function loadStudentFromCSV(): Promise<StudentGradesData> {
  const filePath = path.join(__dirname, 'SampleData.csv')

  let name = ''
  let gradeLevel = 0
  const grades: Grade[] = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false, skipLines: 0 }))
      .on('data', (row: any) => {
        const values = Object.values(row).map(v => String(v).trim())

        // Skip empty rows
        if (!values[0]) return

        // Metadata
        if (values[0] === 'Name') {
          name = values[1]
          return
        }

        if (values[0] === 'Grade') {
          gradeLevel = Number(values[1])
          return
        }

        // Header row
        if (values[0] === 'Subject') return

        // Subject grades
        grades.push({
          subject: values[0],
          quarter1: Number(values[1]),
          quarter2: Number(values[2]),
          quarter3: Number(values[3]),
          quarter4: Number(values[4]),
        })
      })
      .on('end', () => {
        resolve({
          student_id: 1,
          name,
          grade_level: gradeLevel,
          grades
        })
      })
      .on('error', reject)
  })
}

