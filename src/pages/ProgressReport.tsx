import "./page.css";

export default function ProgressReport() {
  const quarterlyGrades = [
    { subject: "FILIPINO", q1: "", q2: "", q3: "", q4: "" },
    { subject: "ENGLISH", q1: "", q2: "", q3: "", q4: "" },
    { subject: "MATHEMATICS", q1: "", q2: "", q3: "", q4: "" },
    { subject: "SCIENCE", q1: "", q2: "", q3: "", q4: "" },
    { subject: "Araling Panlipunan", q1: "", q2: "", q3: "", q4: "" },
    { subject: "Technology and Livelihood Education", q1: "", q2: "", q3: "", q4: "" },
    { subject: "MAPEH", q1: "", q2: "", q3: "", q4: "" },
    { subject: "Music", q1: "", q2: "", q3: "", q4: "", indent: true },
    { subject: "Art", q1: "", q2: "", q3: "", q4: "", indent: true },
    { subject: "Physical Education", q1: "", q2: "", q3: "", q4: "", indent: true },
    { subject: "Health", q1: "", q2: "", q3: "", q4: "", indent: true },
    { subject: "BIBLE (EsP)", q1: "", q2: "", q3: "", q4: "" },
    { subject: "FOREIGN LANGUAGE ARTS", q1: "", q2: "", q3: "", q4: "" },
  ];

  const characterTraits = [
    { trait: "Care for environment", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Consideration for others", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Creativity", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Helpfulness and cooperation", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Honesty and integrity", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Physical well-being", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Respect for authority and others", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Self-discipline & Sense of responsibility", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Punctuality", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Wise use of things", q1: "", q2: "", q3: "", q4: "" },
    { trait: "Quarterly H and B Rating", q1: "", q2: "", q3: "", q4: "", bold: true },
  ];

  const ratings = [
    { label: "Positive Influence", value: 5 },
    { label: "Good, consistent", value: 4 },
    { label: "Good, but not consistent", value: 3 },
    { label: "Fair, average", value: 2 },
    { label: "Not satisfactory", value: 1 },
    { label: "Under discipline", value: 0 },
  ];

  const attendance = {
    months: ["Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Total"],
    daysOfSchool: ["",  "",  "",  "",  "",  "",  "",  "", "", "", ""],
    daysPresent:  ["",  "",  "",  "",  "",  "",  "",  "", "", "", ""],
    daysTardy:    ["",  "",  "",  "",  "",  "",  "",  "", "", "", ""],
  };

  return (
    <div className="report-page">
      <div className="report-container">
        {/* Header */}
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

        {/* Student Info */}
        <div className="student-info">
          <div className="info-row">
            <span className="info-label">LRN:</span>
            <span className="info-value">404147150594</span>
            <span className="info-label ml-auto">Adviser:</span>
            <span className="info-value"></span>
          </div>
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value"></span>
          </div>
          <div className="info-row">
            <span className="info-label">Grade Level:</span>
            <span className="info-value"></span>
            <span className="info-label">Section:</span>
            <span className="info-value"></span>
            <span className="info-label ml-auto">SY:</span>
            <span className="info-value"></span>
          </div>
        </div>

        {/* Grades Table */}
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
            {quarterlyGrades.map((row, i) => (
              <tr key={i}>
                <td className={`subject-name${row.indent ? " indent" : ""}`}>{row.subject}</td>
                <td className="grade-cell">{row.q1}</td>
                <td className="grade-cell">{row.q2}</td>
                <td className="grade-cell">{row.q3}</td>
                <td className="grade-cell">{row.q4}</td>
                <td className="grade-cell"></td>
                <td className="grade-cell"></td>
              </tr>
            ))}
            <tr className="average-row">
              <td className="subject-name bold-cell">Average</td>
              <td className="grade-cell bold-cell"></td>
              <td className="grade-cell bold-cell"></td>
              <td className="grade-cell bold-cell"></td>
              <td className="grade-cell bold-cell"></td>
              <td className="grade-cell bold-cell"></td>
              <td className="grade-cell bold-cell"></td>
            </tr>
            <tr className="rank-row">
              <td className="subject-name bold-cell">Rank:</td>
              <td colSpan={4} className="general-average-cell bold-cell">General Average</td>
              <td className="grade-cell"></td>
              <td className="grade-cell"></td>
            </tr>
          </tbody>
        </table>

        {/* Character Building */}
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
                {characterTraits.map((row, i) => (
                  <tr key={i}>
                    <td className={`trait-name${row.bold ? " bold-cell" : ""}`}>{row.trait}</td>
                    <td className={`cb-cell${row.bold ? " bold-cell" : ""}`}>{row.q1}</td>
                    <td className={`cb-cell${row.bold ? " bold-cell" : ""}`}>{row.q2}</td>
                    <td className="cb-cell">{row.q3}</td>
                    <td className="cb-cell">{row.q4}</td>
                  </tr>
                ))}
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

        {/* Principal */}
        <div className="principal-section">
          <p className="principal-name">Ms. ESTHER JANE Y. UY</p>
          <p className="principal-title">Principal</p>
        </div>

        {/* Attendance */}
        <div className="attendance-section">
          <table className="attendance-table">
            <thead>
              <tr>
                <th className="att-label-header">ATTENDANCE</th>
                {attendance.months.map((m, i) => (
                  <th key={i} className="att-month">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="att-row-label">Days of School</td>
                {attendance.daysOfSchool.map((v, i) => (
                  <td key={i} className="att-cell">{v}</td>
                ))}
              </tr>
              <tr>
                <td className="att-row-label">Days Present</td>
                {attendance.daysPresent.map((v, i) => (
                  <td key={i} className="att-cell">{v}</td>
                ))}
              </tr>
              <tr>
                <td className="att-row-label">Days Tardy</td>
                {attendance.daysTardy.map((v, i) => (
                  <td key={i} className="att-cell">{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
