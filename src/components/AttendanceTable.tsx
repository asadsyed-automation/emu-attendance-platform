import React, { useState } from 'react';
import type { Course, Lecture, AttendanceStatus } from '../types/attendance';
import { OFFICIAL_STUDENTS, UNIVERSITY_INFO } from '../data/initialData';
import { generateCourseCsv, downloadFile } from '../services/storage';
import { Icons } from './Icons';

interface AttendanceTableProps {
  course: Course;
  lectures: Lecture[];
  isUnlocked: boolean;
  onOpenUnlockModal: () => void;
  onOpenMarkModal: () => void;
  onToggleCell: (courseId: string, lectureId: string, rollNo: string, currentStatus: AttendanceStatus) => void;
  onDeleteLecture: (courseId: string, lectureId: string) => void;
  onBackToHome: () => void;
  onSelectStudent: (rollNo: string) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  course,
  lectures,
  isUnlocked,
  onOpenUnlockModal,
  onOpenMarkModal,
  onToggleCell,
  onDeleteLecture,
  onBackToHome,
  onSelectStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShortOnly, setFilterShortOnly] = useState(false);

  // Month range logic for header
  const getMonthRangeString = () => {
    if (lectures.length === 0) return 'September - December';
    try {
      const dates = lectures.map((l) => new Date(l.date));
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      const minMonth = minDate.toLocaleDateString('en-US', { month: 'long' });
      const maxMonth = maxDate.toLocaleDateString('en-US', { month: 'long' });
      if (minMonth === maxMonth) return minMonth;
      return `${minMonth} - ${maxMonth}`;
    } catch {
      return 'September - December';
    }
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const csvData = generateCourseCsv(course, lectures, OFFICIAL_STUDENTS);
    const fileName = `EMU_${course.code.replace(/[^a-zA-Z0-9]/g, '_')}_Attendance_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(csvData, fileName);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Delete lecture confirmation
  const handleDeleteLectureClick = (e: React.MouseEvent, lecture: Lecture) => {
    e.stopPropagation();
    if (!isUnlocked) {
      onOpenUnlockModal();
      return;
    }
    if (window.confirm(`Are you sure you want to remove attendance for ${lecture.displayDate} (${lecture.date})?`)) {
      onDeleteLecture(course.id, lecture.id);
    }
  };

  // Filter students based on search term and short attendance toggle
  const filteredStudents = OFFICIAL_STUDENTS.filter((student) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      student.name.toLowerCase().includes(term) ||
      student.rollNo.toLowerCase().includes(term) ||
      String(student.sr).includes(term);

    if (!matchesSearch) return false;

    if (filterShortOnly) {
      let presents = 0;
      lectures.forEach((lec) => {
        if (lec.records[student.rollNo] === 'P') presents++;
      });
      const pct = lectures.length > 0 ? (presents / lectures.length) * 100 : 100;
      return pct < 75;
    }

    return true;
  });

  return (
    <div className="register-view">
      {/* Top Action & Navigation Bar */}
      <div className="register-top-bar no-print">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackToHome}
        >
          <Icons.ArrowLeft size={16} />
          <span>Back to Courses</span>
        </button>

        <div className="register-controls">
          {/* Print Sheet / PDF */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrint}
            title="Print official Emerson attendance register in A4 landscape format"
          >
            <Icons.Printer size={16} />
            <span>Print Sheet / PDF</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportCsv}
            title="Download CSV spreadsheet"
          >
            <Icons.Download size={16} />
            <span>Export CSV</span>
          </button>

          {/* Mark Attendance Button */}
          {isUnlocked ? (
            <button
              type="button"
              className="btn btn-green"
              onClick={onOpenMarkModal}
            >
              <Icons.Plus size={16} />
              <span>+ Mark New Lecture</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenUnlockModal}
              title="Unlock admin with master password (emu2026) to mark attendance"
            >
              <Icons.Lock size={16} />
              <span>Unlock to Mark Attendance</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          Official University Sheet Header Block (Matches Physical Sheet)
          ========================================================= */}
      <div className="official-sheet-header">
        <div className="sheet-univ-title">
          {UNIVERSITY_INFO.institution}
        </div>
        <div className="sheet-sub-title">
          {UNIVERSITY_INFO.department}
        </div>

        <div className="sheet-meta-grid">
          <div className="meta-field">
            <span className="meta-label">Programme:</span>
            <span className="meta-value">{UNIVERSITY_INFO.programme}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Shift:</span>
            <span className="meta-value">{UNIVERSITY_INFO.shift}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Semester:</span>
            <span className="meta-value">{UNIVERSITY_INFO.semester}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Session:</span>
            <span className="meta-value">{UNIVERSITY_INFO.session}</span>
          </div>

          <div className="meta-field">
            <span className="meta-label">Course Code:</span>
            <span className="meta-value" style={{ color: 'var(--color-maroon-700)' }}>
              {course.code}
            </span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Course Title:</span>
            <span className="meta-value">{course.title}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Credit Hours:</span>
            <span className="meta-value">{course.creditHours}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Teacher:</span>
            <span className="meta-value">{course.teacher}</span>
          </div>

          <div className="meta-field">
            <span className="meta-label">Month(s):</span>
            <span className="meta-value">{getMonthRangeString()}</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Year:</span>
            <span className="meta-value">2026</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Official Strength:</span>
            <span className="meta-value">{UNIVERSITY_INFO.officialStrength} Students</span>
          </div>
          <div className="meta-field">
            <span className="meta-label">Lectures Held:</span>
            <span className="meta-value">{lectures.length} Days</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          The Official Attendance Table Grid
          ========================================================= */}
      <div className="table-card">
        {/* Search & Filter Toolbar */}
        <div className="table-toolbar no-print">
          <div className="search-input-wrapper">
            <Icons.Search size={16} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search student by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.84rem',
                cursor: 'pointer',
                userSelect: 'none',
                color: filterShortOnly ? '#dc2626' : 'var(--text-muted)',
                fontWeight: filterShortOnly ? 700 : 500,
              }}
            >
              <input
                type="checkbox"
                checked={filterShortOnly}
                onChange={(e) => setFilterShortOnly(e.target.checked)}
              />
              <span>Short Attendance Only (&lt;75%)</span>
            </label>

            {isUnlocked && (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#16a34a',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Icons.Sparkles size={14} />
                <span>Click any P/A cell to toggle</span>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="table-scroll-container">
          <table className="official-attendance-table">
            <thead>
              <tr>
                <th className="sticky-col-sr">Sr.</th>
                <th className="sticky-col-roll">Roll No.</th>
                <th className="sticky-col-name">Student Name</th>

                {/* Dynamic Lecture Date Columns */}
                {lectures.map((lec) => (
                  <th
                    key={lec.id}
                    className="date-header-cell"
                    title={`${lec.topic || 'Lecture'} (${lec.date})`}
                  >
                    <div className="date-header-content">
                      <span className="date-day-str">{lec.displayDate}</span>
                      {isUnlocked && (
                        <button
                          type="button"
                          className="date-delete-btn no-print"
                          onClick={(e) => handleDeleteLectureClick(e, lec)}
                          title={`Delete column for ${lec.displayDate}`}
                        >
                          <Icons.Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}

                {/* Summary Columns */}
                <th className="summary-col" title="Total Presents" style={{ background: '#ecfdf5', color: '#166534' }}>
                  P
                </th>
                <th className="summary-col" title="Total Absents" style={{ background: '#fef2f2', color: '#991b1b' }}>
                  A
                </th>
                <th className="summary-col" title="Total Lectures Held">
                  T
                </th>
                <th className="summary-col" title="Attendance Percentage">
                  %
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => {
                let pCount = 0;
                let aCount = 0;

                lectures.forEach((lec) => {
                  const st = lec.records[student.rollNo] || 'P';
                  if (st === 'P') pCount++;
                  else aCount++;
                });

                const total = lectures.length;
                const pct = total > 0 ? Math.round((pCount / total) * 100) : 100;

                return (
                  <tr key={student.rollNo}>
                    {/* Fixed Sticky Columns */}
                    <td className="sticky-col-sr">{student.sr}</td>
                    <td
                      className="sticky-col-roll"
                      style={{ cursor: 'pointer', color: 'var(--color-maroon-700)', fontWeight: 600 }}
                      onClick={() => onSelectStudent(student.rollNo)}
                      title="Click to view overall student report card"
                    >
                      {student.rollNo}
                    </td>
                    <td
                      className="sticky-col-name"
                      style={{ cursor: 'pointer' }}
                      onClick={() => onSelectStudent(student.rollNo)}
                      title="Click to view overall student report card"
                    >
                      {student.name}
                    </td>

                    {/* Dynamic Date Cells */}
                    {lectures.map((lec) => {
                      const status = lec.records[student.rollNo] || 'P';
                      const isPresent = status === 'P';

                      return (
                        <td
                          key={lec.id}
                          className="cell-mark-wrapper"
                          onClick={() => {
                            if (isUnlocked) {
                              onToggleCell(course.id, lec.id, student.rollNo, status);
                            } else {
                              onOpenUnlockModal();
                            }
                          }}
                        >
                          <span
                            className={`attendance-badge ${
                              isPresent ? 'present' : 'absent'
                            } ${isUnlocked ? 'editable' : ''}`}
                            title={
                              isUnlocked
                                ? `Click to change ${student.name} to ${isPresent ? 'Absent (A)' : 'Present (P)'}`
                                : `${student.name}: ${isPresent ? 'Present' : 'Absent'} on ${lec.displayDate}`
                            }
                          >
                            {status}
                          </span>
                        </td>
                      );
                    })}

                    {/* Summary Columns */}
                    <td className="summary-col" style={{ color: '#16a34a' }}>
                      {pCount}
                    </td>
                    <td className="summary-col" style={{ color: '#dc2626' }}>
                      {aCount}
                    </td>
                    <td className="summary-col">{total}</td>
                    <td className="summary-col">
                      <span
                        className={`pct-badge ${
                          pct >= 75
                            ? 'pct-good'
                            : pct >= 60
                            ? 'pct-warning'
                            : 'pct-danger'
                        }`}
                      >
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={3 + lectures.length + 4}
                    style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}
                  >
                    No student found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>

            {/* Table Footer with Daily Attendance Totals */}
            <tfoot>
              <tr style={{ fontWeight: 'bold', background: 'var(--bg-table-header)' }}>
                <td colSpan={3} style={{ textAlign: 'right', paddingRight: '1rem' }}>
                  Daily Presents Total:
                </td>

                {lectures.map((lec) => {
                  let dayPresents = 0;
                  OFFICIAL_STUDENTS.forEach((st) => {
                    if (lec.records[st.rollNo] === 'P') dayPresents++;
                  });
                  return (
                    <td key={lec.id} style={{ textAlign: 'center', color: '#16a34a' }}>
                      {dayPresents}
                    </td>
                  );
                })}

                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Active Students: {OFFICIAL_STUDENTS.length}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Official Signatures Block for Printout (Shown only when printing) */}
      <div className="print-signature-block" style={{ display: 'none' }}>
        <div>
          <div style={{ borderTop: '1px solid #000', width: '180px', textAlign: 'center', paddingTop: '4px' }}>
            Course Teacher's Signature
          </div>
        </div>
        <div>
          <div style={{ borderTop: '1px solid #000', width: '180px', textAlign: 'center', paddingTop: '4px' }}>
            In-Charge CS & IT Dept.
          </div>
        </div>
        <div>
          <div style={{ borderTop: '1px solid #000', width: '180px', textAlign: 'center', paddingTop: '4px' }}>
            Dean / Chairperson
          </div>
        </div>
      </div>
    </div>
  );
};
