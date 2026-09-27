import React, { useState } from 'react';
import type { CourseAttendance, StudentOverallReport } from '../types/attendance';
import { OFFICIAL_STUDENTS } from '../data/initialData';
import { getStudentOverallReport } from '../services/storage';
import { Icons } from './Icons';

interface StudentLookupModalProps {
  isOpen: boolean;
  initialRollNo?: string;
  attendanceData: Record<string, CourseAttendance>;
  onClose: () => void;
  onNavigateToCourse?: (courseId: string) => void;
}

export const StudentLookupModal: React.FC<StudentLookupModalProps> = ({
  isOpen,
  initialRollNo = '',
  attendanceData,
  onClose,
  onNavigateToCourse,
}) => {
  const [query, setQuery] = useState(initialRollNo);
  const [selectedStudentRoll, setSelectedStudentRoll] = useState(
    initialRollNo || OFFICIAL_STUDENTS[0]?.rollNo
  );

  if (!isOpen) return null;

  // Filter student dropdown/results
  const matchingStudents = OFFICIAL_STUDENTS.filter((s) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      String(s.sr).includes(q)
    );
  });

  const report: StudentOverallReport | null = selectedStudentRoll
    ? getStudentOverallReport(selectedStudentRoll, attendanceData)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <Icons.GraduationCap size={22} style={{ color: 'var(--color-maroon-700)' }} />
            <span>Student Attendance Report Card</span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onClose}
          >
            <Icons.X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Search Box */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="student-search-report">
              🔍 Select or Search Student by Roll Number / Name
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <input
                  id="student-search-report"
                  type="text"
                  className="search-input"
                  placeholder="Type name or roll no (e.g. 114, Asad, Mujtaba)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <Icons.Search size={16} className="search-input-icon" />
              </div>

              {/* Quick Dropdown Picker */}
              <select
                className="form-input"
                style={{ width: 'auto', minWidth: '240px' }}
                value={selectedStudentRoll}
                onChange={(e) => setSelectedStudentRoll(e.target.value)}
              >
                {matchingStudents.map((s) => (
                  <option key={s.rollNo} value={s.rollNo}>
                    #{s.sr} · {s.rollNo} ({s.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Profile & Cumulative Summary Header */}
          {report ? (
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--color-maroon-700), var(--color-maroon-900))',
                  color: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>
                    BS Computer Science · 7th Semester (Evening)
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.2rem 0' }}>
                    {report.student.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <span>Roll No: <strong>{report.student.rollNo}</strong></span>
                    <span>•</span>
                    <span>Sr #: <strong>{report.student.sr}</strong></span>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', opacity: 0.85 }}>
                    Overall Attendance
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: report.averagePercentage >= 75 ? '#86efac' : '#fca5a5' }}>
                    {report.averagePercentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {report.totalPresents} / {report.totalLectures} Total Presents
                  </div>
                </div>
              </div>

              {/* Exam Eligibility Notice */}
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: report.averagePercentage >= 75 ? '#dcfce7' : '#fee2e2',
                  color: report.averagePercentage >= 75 ? '#15803d' : '#991b1b',
                  border: `1px solid ${report.averagePercentage >= 75 ? '#86efac' : '#fca5a5'}`,
                }}
              >
                {report.averagePercentage >= 75 ? (
                  <>
                    <Icons.CheckCircle2 size={18} />
                    <span>Eligible for Final Examinations (Attendance meets university criteria &ge; 75%)</span>
                  </>
                ) : (
                  <>
                    <Icons.AlertTriangle size={18} />
                    <span>
                      Short Attendance Warning: Attendance is below 75% requirement in {report.shortAttendanceCourses} subject(s).
                    </span>
                  </>
                )}
              </div>

              {/* Subject Breakdown Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Course-by-Course Attendance Breakdown
                </h4>

                {report.courses.map((cs) => {
                  const isEligible = cs.percentage >= 75;

                  return (
                    <div
                      key={cs.courseId}
                      onClick={() => onNavigateToCourse?.(cs.courseId)}
                      title="Click to open this subject's official attendance register"
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease, transform 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '0.5rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              className={`course-code-tag ${cs.isLab ? 'is-lab' : ''}`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {cs.courseCode}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                              {cs.courseTitle}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Teacher: {cs.teacher} · Cr Hrs: {cs.creditHours}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span
                            className={`pct-badge ${
                              isEligible ? 'pct-good' : cs.percentage >= 60 ? 'pct-warning' : 'pct-danger'
                            }`}
                            style={{ fontSize: '0.85rem' }}
                          >
                            {cs.percentage}%
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {cs.presents}P / {cs.absents}A ({cs.total} Days)
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          borderRadius: '9999px',
                          background: 'var(--bg-card-subtle)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${cs.percentage}%`,
                            height: '100%',
                            background: isEligible ? '#16a34a' : cs.percentage >= 60 ? '#d97706' : '#dc2626',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Select a student to view their attendance report.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
