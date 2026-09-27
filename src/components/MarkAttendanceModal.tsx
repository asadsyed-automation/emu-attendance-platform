import React, { useState, useEffect } from 'react';
import type { Course, AttendanceStatus, Student } from '../types/attendance';
import { OFFICIAL_STUDENTS } from '../data/initialData';
import { Icons } from './Icons';
import { triggerCelebrationConfetti } from './Confetti';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  course: Course | null;
  onClose: () => void;
  onSave: (courseId: string, lectureData: { date: string; topic?: string; records: Record<string, AttendanceStatus> }) => void;
}

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  course,
  onClose,
  onSave,
}) => {
  // Default to today's ISO date string YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getTodayStr());
  const [topic, setTopic] = useState('');
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Reset and initialize all students to 'P' whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const initialMap: Record<string, AttendanceStatus> = {};
      OFFICIAL_STUDENTS.forEach((st) => {
        initialMap[st.rollNo] = 'P'; // Default all 58 to Present
      });
      setRecords(initialMap);
      setDate(getTodayStr());
      setTopic('');
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen || !course) return null;

  // Toggle single student status between P and A
  const toggleStudent = (rollNo: string) => {
    setRecords((prev) => ({
      ...prev,
      [rollNo]: prev[rollNo] === 'P' ? 'A' : 'P',
    }));
  };

  const setStudentStatus = (rollNo: string, status: AttendanceStatus) => {
    setRecords((prev) => ({
      ...prev,
      [rollNo]: status,
    }));
  };

  // Bulk actions
  const markAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    OFFICIAL_STUDENTS.forEach((st) => {
      updated[st.rollNo] = status;
    });
    setRecords(updated);
  };

  const invertAll = () => {
    const updated: Record<string, AttendanceStatus> = {};
    OFFICIAL_STUDENTS.forEach((st) => {
      updated[st.rollNo] = records[st.rollNo] === 'P' ? 'A' : 'P';
    });
    setRecords(updated);
  };

  // Calculate live counts
  let presentCount = 0;
  let absentCount = 0;
  OFFICIAL_STUDENTS.forEach((st) => {
    if (records[st.rollNo] === 'P') presentCount++;
    else absentCount++;
  });

  const filteredStudents = OFFICIAL_STUDENTS.filter((st) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      st.name.toLowerCase().includes(term) ||
      st.rollNo.toLowerCase().includes(term) ||
      String(st.sr).includes(term)
    );
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert('Please select a valid lecture date.');
      return;
    }

    onSave(course.id, {
      date,
      topic,
      records,
    });

    triggerCelebrationConfetti();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">
              <Icons.Calendar size={20} style={{ color: 'var(--color-maroon-700)' }} />
              <span>Mark Attendance: {course.code}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {course.title} · Teacher: {course.teacher}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onClose}
          >
            <Icons.X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* Date & Topic Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="lecture-date-input">
                  📅 Lecture Date (Calendar Picker)
                </label>
                <input
                  id="lecture-date-input"
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="lecture-topic-input">
                  Lecture Topic / Notes (Optional)
                </label>
                <input
                  id="lecture-topic-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chapter 4: Dynamic Programming"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>

            {/* Quick Stats & Bulk Actions Bar */}
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
                border: '1px solid var(--border-light)',
              }}
            >
              {/* Counters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Total: </span>
                  <strong>{OFFICIAL_STUDENTS.length}</strong>
                </div>
                <div>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Presents (P): </span>
                  <strong style={{ color: '#16a34a' }}>{presentCount}</strong>
                </div>
                <div>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>Absents (A): </span>
                  <strong style={{ color: '#dc2626' }}>{absentCount}</strong>
                </div>
              </div>

              {/* Bulk Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => markAll('P')}
                  title="Mark All Present"
                >
                  <Icons.UserCheck size={14} style={{ color: '#16a34a' }} />
                  <span>All P</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => markAll('A')}
                  title="Mark All Absent"
                >
                  <Icons.UserX size={14} style={{ color: '#dc2626' }} />
                  <span>All A</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={invertAll}
                  title="Invert Presents and Absents"
                >
                  <span>Invert</span>
                </button>
              </div>
            </div>

            {/* Student Search in Modal */}
            <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search student name or roll number to toggle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icons.Search size={16} className="search-input-icon" />
            </div>

            {/* Student 58 Roster List */}
            <div className="marking-roster-list">
              {filteredStudents.map((st: Student) => {
                const status = records[st.rollNo] || 'P';
                const isPresent = status === 'P';

                return (
                  <div
                    key={st.rollNo}
                    className="marking-student-row"
                    onClick={() => toggleStudent(st.rollNo)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="student-info-cell">
                      <span className="student-sr-badge">{st.sr}</span>
                      <div>
                        <div className="student-name-text">{st.name}</div>
                        <div className="student-roll-text">{st.rollNo}</div>
                      </div>
                    </div>

                    <div
                      className="marking-status-toggle"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className={`toggle-btn-opt ${
                          isPresent ? 'active-p' : 'inactive'
                        }`}
                        onClick={() => setStudentStatus(st.rollNo, 'P')}
                      >
                        <Icons.Check size={13} />
                        <span>P</span>
                      </button>
                      <button
                        type="button"
                        className={`toggle-btn-opt ${
                          !isPresent ? 'active-a' : 'inactive'
                        }`}
                        onClick={() => setStudentStatus(st.rollNo, 'A')}
                      >
                        <Icons.X size={13} />
                        <span>A</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  No student matches "{searchTerm}"
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-green"
            >
              <Icons.CheckCircle2 size={16} />
              <span>Save & Add to Attendance Sheet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
