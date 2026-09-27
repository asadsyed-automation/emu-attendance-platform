import { useState, useEffect } from 'react';
import type { Course, CourseAttendance, AttendanceStatus } from './types/attendance';
import { OFFICIAL_COURSES, OFFICIAL_STUDENTS, UNIVERSITY_INFO } from './data/initialData';
import {
  getStoredAttendance,
  isSessionUnlocked,
  setSessionUnlocked,
  addLectureToCourse,
  updateCellStatus,
  deleteLectureFromCourse,
} from './services/storage';
import { Navbar } from './components/Navbar';
import { CourseCard } from './components/CourseCard';
import { AttendanceTable } from './components/AttendanceTable';
import { PasswordModal } from './components/PasswordModal';
import { MarkAttendanceModal } from './components/MarkAttendanceModal';
import { StudentLookupModal } from './components/StudentLookupModal';
import { SettingsModal } from './components/SettingsModal';
import { Icons } from './components/Icons';

export function App() {
  const [attendanceData, setAttendanceData] = useState<Record<string, CourseAttendance>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [markingCourse, setMarkingCourse] = useState<Course | null>(null);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [lookupInitialRoll, setLookupInitialRoll] = useState<string>('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('emu_portal_theme_v1');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Initialize data on mount
  useEffect(() => {
    const stored = getStoredAttendance();
    setAttendanceData(stored);
    setIsUnlocked(isSessionUnlocked());
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('emu_portal_theme_v1', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAdminUnlockSuccess = () => {
    setIsUnlocked(true);
    setSessionUnlocked(true);
  };

  const handleAdminLock = () => {
    setIsUnlocked(false);
    setSessionUnlocked(false);
  };

  // Open Marking modal for specific course
  const handleOpenMarkModal = (courseId: string) => {
    const course = OFFICIAL_COURSES.find((c) => c.id === courseId) || null;
    if (course) {
      setMarkingCourse(course);
      setIsMarkModalOpen(true);
    }
  };

  // Save new lecture attendance
  const handleSaveLecture = (
    courseId: string,
    lectureData: { date: string; topic?: string; records: Record<string, AttendanceStatus> }
  ) => {
    const { updatedMap } = addLectureToCourse(courseId, lectureData, attendanceData);
    setAttendanceData(updatedMap);
  };

  // Inline cell toggle
  const handleToggleCell = (
    courseId: string,
    lectureId: string,
    rollNo: string,
    currentStatus: AttendanceStatus
  ) => {
    const newStatus: AttendanceStatus = currentStatus === 'P' ? 'A' : 'P';
    const updated = updateCellStatus(courseId, lectureId, rollNo, newStatus, attendanceData);
    setAttendanceData(updated);
  };

  // Delete lecture
  const handleDeleteLecture = (courseId: string, lectureId: string) => {
    const updated = deleteLectureFromCourse(courseId, lectureId, attendanceData);
    setAttendanceData(updated);
  };

  // Student report card trigger
  const handleOpenStudentReport = (rollNo: string) => {
    setLookupInitialRoll(rollNo);
    setIsLookupModalOpen(true);
  };

  // Selected course object
  const selectedCourse = OFFICIAL_COURSES.find((c) => c.id === selectedCourseId) || null;
  const currentCourseLectures = selectedCourseId
    ? attendanceData[selectedCourseId]?.lectures || []
    : [];

  // Summary statistics for Home Screen
  let totalLecturesConducted = 0;
  let totalClassPresents = 0;
  let totalClassPossibles = 0;

  OFFICIAL_COURSES.forEach((course) => {
    const lecs = attendanceData[course.id]?.lectures || [];
    totalLecturesConducted += lecs.length;

    lecs.forEach((lec) => {
      OFFICIAL_STUDENTS.forEach((st) => {
        totalClassPossibles++;
        if (lec.records[st.rollNo] === 'P') {
          totalClassPresents++;
        }
      });
    });
  });

  const overallClassAverage =
    totalClassPossibles > 0
      ? Math.round((totalClassPresents / totalClassPossibles) * 100)
      : 100;

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <Navbar
        isUnlocked={isUnlocked}
        onOpenUnlockModal={() => setIsPasswordModalOpen(true)}
        onLockAdmin={handleAdminLock}
        onOpenLookup={() => {
          setLookupInitialRoll('');
          setIsLookupModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onNavigateHome={() => setSelectedCourseId(null)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main-content">
        {!selectedCourse ? (
          /* =========================================================
             1. Home / Course Selector Screen (/)
             ========================================================= */
          <div>
            {/* Hero Academic Header */}
            <div className="hero-banner">
              <div className="hero-badge">
                <Icons.GraduationCap size={14} />
                <span>Department of CS & IT · Emerson University Multan</span>
              </div>

              <h1 className="hero-title">
                Student Attendance Portal
              </h1>

              <p className="hero-subtitle">
                Official Attendance Management Platform for <strong>BS Computer Science, 7th Semester</strong> (Session 2023-27), <strong>Evening Shift</strong>.
              </p>

              <div className="hero-stats-row">
                <div className="hero-stat-card">
                  <div className="hero-stat-label">Enrolled Students</div>
                  <div className="hero-stat-value">{UNIVERSITY_INFO.officialStrength} Strength</div>
                </div>

                <div className="hero-stat-card">
                  <div className="hero-stat-label">Total Courses</div>
                  <div className="hero-stat-value">7 Subjects</div>
                </div>

                <div className="hero-stat-card">
                  <div className="hero-stat-label">Total Lectures Held</div>
                  <div className="hero-stat-value">{totalLecturesConducted} Sessions</div>
                </div>

                <div className="hero-stat-card">
                  <div className="hero-stat-label">Class Overall Avg</div>
                  <div className="hero-stat-value" style={{ color: '#86efac' }}>
                    {overallClassAverage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid Header */}
            <div className="section-header">
              <div className="section-title">
                <Icons.BookOpen size={22} style={{ color: 'var(--color-maroon-700)' }} />
                <span>Semester Courses &amp; Registers</span>
                <span className="section-badge">7 Official Subjects</span>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setLookupInitialRoll('');
                    setIsLookupModalOpen(true);
                  }}
                >
                  <Icons.Search size={14} />
                  <span>Student Roll Check</span>
                </button>

                {!isUnlocked && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsPasswordModalOpen(true)}
                  >
                    <Icons.Lock size={14} />
                    <span>🔒 Unlock Admin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Grid of the 7 Subjects */}
            <div className="courses-grid">
              {OFFICIAL_COURSES.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  attendanceData={attendanceData[course.id]}
                  isUnlocked={isUnlocked}
                  onSelectCourse={(courseId) => setSelectedCourseId(courseId)}
                  onMarkCourseLecture={(courseId) => handleOpenMarkModal(courseId)}
                />
              ))}
            </div>

            {/* Information Footer Banner */}
            <div
              style={{
                marginTop: '2.5rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                background: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--color-maroon-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-maroon-700)',
                  }}
                >
                  <Icons.Info size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    University 75% Attendance Requirement
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Students with less than 75% attendance in any theory or lab subject will be ineligible for final term exams.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setLookupInitialRoll('');
                  setIsLookupModalOpen(true);
                }}
              >
                <span>Check Eligibility</span>
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================
             2. Official Attendance Register Screen (/attendance/:courseCode)
             ========================================================= */
          <AttendanceTable
            course={selectedCourse}
            lectures={currentCourseLectures}
            isUnlocked={isUnlocked}
            onOpenUnlockModal={() => setIsPasswordModalOpen(true)}
            onOpenMarkModal={() => handleOpenMarkModal(selectedCourse.id)}
            onToggleCell={handleToggleCell}
            onDeleteLecture={handleDeleteLecture}
            onBackToHome={() => setSelectedCourseId(null)}
            onSelectStudent={handleOpenStudentReport}
          />
        )}
      </main>

      {/* Global Modals */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleAdminUnlockSuccess}
      />

      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        course={markingCourse}
        onClose={() => {
          setIsMarkModalOpen(false);
          setMarkingCourse(null);
        }}
        onSave={handleSaveLecture}
      />

      <StudentLookupModal
        isOpen={isLookupModalOpen}
        initialRollNo={lookupInitialRoll}
        attendanceData={attendanceData}
        onClose={() => setIsLookupModalOpen(false)}
        onNavigateToCourse={(courseId) => {
          setIsLookupModalOpen(false);
          setSelectedCourseId(courseId);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        attendanceData={attendanceData}
        onClose={() => setIsSettingsModalOpen(false)}
        onDataUpdated={(newData) => setAttendanceData(newData)}
      />
    </div>
  );
}

export default App;
