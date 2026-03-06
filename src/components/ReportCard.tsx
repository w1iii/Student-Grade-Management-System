import './ReportCard.css'

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

interface StudentInfo {
  LRN: string
  first_name: string
  last_name: string
  adviser: string
  section: string
  sy: string
  gradeLevel: string
}

interface ReportCardProps {
  studentInfo: StudentInfo
  grades: Grade[]
  traits?: Trait[]
  attendance?: Attendance[]
  onGradeChange?: (subjectIndex: number, quarter: string, value: string) => void
  onCellBlur?: (subjectIndex: number, quarter: string) => void
  editingCell?: string | null
  onCellClick?: (cellId: string) => void
}

const defaultTraits: Trait[] = [
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

const defaultAttendance: Attendance[] = [
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

const ratings = [
  { label: 'Positive Influence', value: 5 },
  { label: 'Good, consistent', value: 4 },
  { label: 'Good, but not consistent', value: 3 },
  { label: 'Fair, average', value: 2 },
  { label: 'Not satisfactory', value: 1 },
  { label: 'Under discipline', value: 0 },
]

function calculateFinalGrade(grade: Grade): number {
  const grades = [grade.quarter1, grade.quarter2, grade.quarter3, grade.quarter4].filter((g): g is number => g !== null && g > 0)
  if (grades.length === 0) return 0
  return Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100
}

function getActionTaken(finalGrade: number): string {
  if (finalGrade >= 75) return 'Passed'
  if (finalGrade >= 0) return 'Failed'
  return ''
}

function getQuarterlyAverage(grades: Grade[], quarter: number): number {
  const quarterKey = `quarter${quarter}` as keyof Grade
  const quarterGrades = grades
    .map(g => g[quarterKey])
    .filter((g): g is number => g !== null && typeof g === 'number' && g > 0)
  if (quarterGrades.length === 0) return 0
  return Math.round((quarterGrades.reduce((a, b) => a + b, 0) / quarterGrades.length) * 100) / 100
}

function getGeneralAverage(grades: Grade[]): number {
  const finalGrades = grades.map(g => calculateFinalGrade(g)).filter(g => g > 0)
  if (finalGrades.length === 0) return 0
  return Math.round((finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length) * 100) / 100
}

export default function ReportCard({
  studentInfo,
  grades,
  traits,
  attendance,
  onGradeChange,
  onCellBlur,
  editingCell,
  onCellClick
}: ReportCardProps) {
  const displayTraits = (traits && traits.length > 0) ? traits : defaultTraits
  const displayAttendance = (attendance && attendance.length > 0) ? attendance : defaultAttendance

  const totals = displayAttendance.reduce(
    (acc, att) => ({
      daysOfSchool: acc.daysOfSchool + att.daysOfSchool,
      daysPresent: acc.daysPresent + att.daysPresent,
      daysTardy: acc.daysTardy + att.daysTardy
    }),
    { daysOfSchool: 0, daysPresent: 0, daysTardy: 0 }
  )

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <div className="school-logo">
            <div className="logo-circle">
              <span className="logo-text">BTCS</span>
            </div>
          </div>
          <div className="school-info">
            <h1 className="school-name">BACOLOD TRINITY CHRISTIAN SCHOOL, INC.
              <span className="deped-form">DepEd Form 138</span>
            </h1>
            <p className="school-address">Villa Angela Subdivision, Phase 3, Bacolod City</p>
            <p className="school-address">DepEd Recognition No. S-04 s. 1986</p>
            <p className="school-address accredited">ACCREDITED BY ACSCU-ACI, CERTIFIED BY FAAP</p>
          </div>
        </div>

        <h2 className="report-title">PROGRESS REPORT</h2>
        <h3 className="report-subtitle">(High School)</h3>

        <div className="student-info">
          <div className="info-row">
            <span className="info-label">LRN:</span>
            <span className="info-value">{studentInfo.LRN}</span>
            <span className="info-label ml-auto">Adviser:</span>
            <span className="info-value">{studentInfo.adviser}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value">{studentInfo.last_name}, {studentInfo.first_name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Grade Level:</span>
            <span className="info-value">{studentInfo.gradeLevel}</span>
            <span className="info-label">Section:</span>
            <span className="info-value">{studentInfo.section}</span>
            <span className="info-label ml-auto">SY:</span>
            <span className="info-value">{studentInfo.sy}</span>
          </div>
        </div>

        <table className="grades-table">
          <thead>
            <tr>
              <th rowSpan={2} className="subjects-header">SUBJECTS</th>
              <th colSpan={4} className="quarterly-header">QUARTERLY GRADES</th>
              <th rowSpan={2} className="final-header">Final<br />Grade</th>
              <th rowSpan={2} className="action-header">Action<br />Taken</th>
            </tr>
            <tr>
              <th className="quarter-col">1st</th>
              <th className="quarter-col">2nd</th>
              <th className="quarter-col">3rd</th>
              <th className="quarter-col">4th</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade, i) => {
              const finalGrade = calculateFinalGrade(grade)
              return (
                <tr key={i}>
                  <td className="subject-name">{grade.subject}</td>
                  {['quarter1', 'quarter2', 'quarter3', 'quarter4'].map((quarter) => {
                    const cellId = `${i}-${quarter}`
                    const isEditing = editingCell === cellId
                    const value = grade[quarter as keyof Grade]

                    return (
                      <td
                        key={quarter}
                        className="grade-cell"
                        onClick={() => onCellClick?.(cellId)}
                      >
                        {isEditing && onGradeChange ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            autoFocus
                            value={value ?? ''}
                            onChange={(e) => onGradeChange(i, quarter, e.target.value)}
                            onBlur={() => onCellBlur?.(i, quarter)}
                            className="grade-input"
                          />
                        ) : (
                          <span className={value === null || value === 0 ? 'null-grade' : ''}>
                            {value ?? '-'}
                          </span>
                        )}
                      </td>
                    )
                  })}
                  <td className="grade-cell final-grade">{finalGrade > 0 ? finalGrade : '-'}</td>
                  <td className="grade-cell action-taken">{getActionTaken(finalGrade)}</td>
                </tr>
              )
            })}
            <tr className="average-row">
              <td className="subject-name bold-cell">Average</td>
              <td className="grade-cell bold-cell">{getQuarterlyAverage(grades, 1)}</td>
              <td className="grade-cell bold-cell">{getQuarterlyAverage(grades, 2)}</td>
              <td className="grade-cell bold-cell">{getQuarterlyAverage(grades, 3)}</td>
              <td className="grade-cell bold-cell">{getQuarterlyAverage(grades, 4)}</td>
              <td className="grade-cell bold-cell final-grade">{getGeneralAverage(grades)}</td>
              <td className="grade-cell bold-cell"></td>
            </tr>
            <tr className="rank-row">
              <td className="subject-name bold-cell">Rank:</td>
              <td colSpan={4} className="general-average-cell bold-cell">General Average</td>
              <td className="grade-cell">{getGeneralAverage(grades)}</td>
              <td className="grade-cell"></td>
            </tr>
          </tbody>
        </table>

        <div className="character-section">
          <h3 className="section-title">CHARACTER BUILDING</h3>
          <div className="character-layout">
            <table className="character-table">
              <thead>
                <tr>
                  <th className="trait-header">TRAITS</th>
                  <th className="cb-quarter">1st</th>
                  <th className="cb-quarter">2nd</th>
                  <th className="cb-quarter">3rd</th>
                  <th className="cb-quarter">4th</th>
                </tr>
              </thead>
              <tbody>
                {displayTraits.map((row, i) => (
                  <tr key={i}>
                    <td className="trait-name">{row.trait}</td>
                    <td className="cb-cell">{row.quarter1 || '-'}</td>
                    <td className="cb-cell">{row.quarter2 || '-'}</td>
                    <td className="cb-cell">{row.quarter3 || '-'}</td>
                    <td className="cb-cell">{row.quarter4 || '-'}</td>
                  </tr>
                ))}
                <tr className="average-row">
                  <td className="trait-name bold-cell">Quarterly H and B Rating</td>
                  <td className="cb-cell bold-cell">-</td>
                  <td className="cb-cell bold-cell">-</td>
                  <td className="cb-cell bold-cell">-</td>
                  <td className="cb-cell bold-cell">-</td>
                </tr>
              </tbody>
            </table>

            <div className="ratings-box">
              <p className="ratings-title">Character Building Ratings:</p>
              {ratings.map((r, i) => (
                <div key={i} className="rating-row">
                  <span className="rating-label">{r.label}</span>
                  <span className="rating-value">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="principal-section">
          <p className="principal-name">Ms. ESTHER JANE Y. UY</p>
          <p className="principal-title">Principal</p>
        </div>

        <div className="attendance-section">
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="att-label-header">ATTENDANCE</th>
                {displayAttendance.map((att, i) => (
                  <th key={i} className="att-month">{att.month}</th>
                ))}
                <th className="att-month">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="att-row-label">Days of School</td>
                {displayAttendance.map((att, i) => (
                  <td key={i} className="att-cell">{att.daysOfSchool || '-'}</td>
                ))}
                <td className="att-cell bold-cell">{totals.daysOfSchool || '-'}</td>
              </tr>
              <tr>
                <td className="att-row-label">Days Present</td>
                {displayAttendance.map((att, i) => (
                  <td key={i} className="att-cell">{att.daysPresent || '-'}</td>
                ))}
                <td className="att-cell bold-cell">{totals.daysPresent || '-'}</td>
              </tr>
              <tr>
                <td className="att-row-label">Days Tardy</td>
                {displayAttendance.map((att, i) => (
                  <td key={i} className="att-cell">{att.daysTardy || '-'}</td>
                ))}
                <td className="att-cell bold-cell">{totals.daysTardy || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
