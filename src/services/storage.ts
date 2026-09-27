import type {
  CourseAttendance,
  Lecture,
  AttendanceStatus,
  Student,
  Course,
  StudentCourseStats,
  StudentOverallReport,
} from '../types/attendance';
import {
  INITIAL_ATTENDANCE_DATA,
  DEFAULT_MASTER_PASSWORD,
  OFFICIAL_COURSES,
  OFFICIAL_STUDENTS,
  formatDisplayDate,
} from '../data/initialData';

const STORAGE_KEYS = {
  ATTENDANCE: 'emu_attendance_records_v1',
  MASTER_PASSWORD: 'emu_master_password_v1',
  IS_UNLOCKED: 'emu_session_unlocked_v1',
  THEME: 'emu_portal_theme_v1',
};

// --- Attendance State Helpers ---
export function getStoredAttendance(): Record<string, CourseAttendance> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      saveStoredAttendance(INITIAL_ATTENDANCE_DATA);
      return INITIAL_ATTENDANCE_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse attendance data from localStorage:', err);
    return INITIAL_ATTENDANCE_DATA;
  }
}

export function saveStoredAttendance(data: Record<string, CourseAttendance>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save attendance data:', err);
  }
}

export function resetPortalData(): Record<string, CourseAttendance> {
  saveStoredAttendance(INITIAL_ATTENDANCE_DATA);
  return INITIAL_ATTENDANCE_DATA;
}

// --- Master Password / Admin State ---
export function getMasterPassword(): string {
  return localStorage.getItem(STORAGE_KEYS.MASTER_PASSWORD) || DEFAULT_MASTER_PASSWORD;
}

export function setMasterPassword(newPassword: string): void {
  localStorage.setItem(STORAGE_KEYS.MASTER_PASSWORD, newPassword);
}

export function isSessionUnlocked(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.IS_UNLOCKED) === 'true';
}

export function setSessionUnlocked(unlocked: boolean): void {
  if (unlocked) {
    sessionStorage.setItem(STORAGE_KEYS.IS_UNLOCKED, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.IS_UNLOCKED);
  }
}

export function verifyPassword(inputPassword: string): boolean {
  const currentPassword = getMasterPassword();
  return inputPassword.trim() === currentPassword.trim();
}

// --- Course Attendance Operations ---
export function getCourseAttendance(
  courseId: string,
  attendanceMap: Record<string, CourseAttendance>
): Lecture[] {
  return attendanceMap[courseId]?.lectures || [];
}

export function addLectureToCourse(
  courseId: string,
  lectureData: { date: string; topic?: string; records: Record<string, AttendanceStatus> },
  attendanceMap: Record<string, CourseAttendance>
): { updatedMap: Record<string, CourseAttendance>; newLecture: Lecture } {
  const currentLectures = [...(attendanceMap[courseId]?.lectures || [])];
  
  const newLecture: Lecture = {
    id: `lec-${courseId}-${lectureData.date}-${Date.now()}`,
    date: lectureData.date,
    displayDate: formatDisplayDate(lectureData.date),
    topic: lectureData.topic?.trim() || `Lecture held on ${formatDisplayDate(lectureData.date)}`,
    records: { ...lectureData.records },
    createdAt: new Date().toISOString(),
  };

  // Check if lecture with exact same date already exists, if so update/merge or append
  const existingIdx = currentLectures.findIndex((l) => l.date === lectureData.date);
  if (existingIdx >= 0) {
    currentLectures[existingIdx] = newLecture;
  } else {
    // Insert sorted by date ascending
    currentLectures.push(newLecture);
    currentLectures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const updatedMap: Record<string, CourseAttendance> = {
    ...attendanceMap,
    [courseId]: {
      courseId,
      lectures: currentLectures,
    },
  };

  saveStoredAttendance(updatedMap);
  return { updatedMap, newLecture };
}

export function updateCellStatus(
  courseId: string,
  lectureId: string,
  rollNo: string,
  newStatus: AttendanceStatus,
  attendanceMap: Record<string, CourseAttendance>
): Record<string, CourseAttendance> {
  const courseData = attendanceMap[courseId];
  if (!courseData) return attendanceMap;

  const updatedLectures = courseData.lectures.map((lec) => {
    if (lec.id === lectureId) {
      return {
        ...lec,
        records: {
          ...lec.records,
          [rollNo]: newStatus,
        },
      };
    }
    return lec;
  });

  const updatedMap: Record<string, CourseAttendance> = {
    ...attendanceMap,
    [courseId]: {
      courseId,
      lectures: updatedLectures,
    },
  };

  saveStoredAttendance(updatedMap);
  return updatedMap;
}

export function deleteLectureFromCourse(
  courseId: string,
  lectureId: string,
  attendanceMap: Record<string, CourseAttendance>
): Record<string, CourseAttendance> {
  const courseData = attendanceMap[courseId];
  if (!courseData) return attendanceMap;

  const updatedLectures = courseData.lectures.filter((l) => l.id !== lectureId);
  const updatedMap: Record<string, CourseAttendance> = {
    ...attendanceMap,
    [courseId]: {
      courseId,
      lectures: updatedLectures,
    },
  };

  saveStoredAttendance(updatedMap);
  return updatedMap;
}

// --- Statistics & Calculations ---
export function calculateStudentCourseStats(
  student: Student,
  course: Course,
  lectures: Lecture[]
): StudentCourseStats {
  let presents = 0;
  let absents = 0;

  lectures.forEach((lec) => {
    const status = lec.records[student.rollNo];
    if (status === 'P') {
      presents++;
    } else if (status === 'A') {
      absents++;
    }
  });

  const total = lectures.length;
  const percentage = total > 0 ? Math.round((presents / total) * 100) : 100;
  const eligible = percentage >= 75;

  return {
    courseId: course.id,
    courseCode: course.code,
    courseTitle: course.title,
    creditHours: course.creditHours,
    teacher: course.teacher,
    isLab: course.isLab,
    presents,
    absents,
    total,
    percentage,
    eligible,
  };
}

export function getStudentOverallReport(
  rollNo: string,
  attendanceMap: Record<string, CourseAttendance>
): StudentOverallReport | null {
  const student = OFFICIAL_STUDENTS.find(
    (s) => s.rollNo.toLowerCase() === rollNo.toLowerCase()
  );
  if (!student) return null;

  const courseStats: StudentCourseStats[] = OFFICIAL_COURSES.map((course) => {
    const lectures = getCourseAttendance(course.id, attendanceMap);
    return calculateStudentCourseStats(student, course, lectures);
  });

  let totalPresents = 0;
  let totalAbsents = 0;
  let totalLectures = 0;
  let shortAttendanceCourses = 0;

  courseStats.forEach((stat) => {
    totalPresents += stat.presents;
    totalAbsents += stat.absents;
    totalLectures += stat.total;
    if (stat.total > 0 && stat.percentage < 75) {
      shortAttendanceCourses++;
    }
  });

  const averagePercentage =
    totalLectures > 0 ? Math.round((totalPresents / totalLectures) * 100) : 100;

  return {
    student,
    courses: courseStats,
    totalPresents,
    totalAbsents,
    totalLectures,
    averagePercentage,
    shortAttendanceCourses,
  };
}

// --- CSV Export Helper ---
export function generateCourseCsv(
  course: Course,
  lectures: Lecture[],
  students: Student[]
): string {
  // Emerson Header Block
  const headerLines = [
    `"EMERSON UNIVERSITY MULTAN - ATTENDANCE REGISTER"`,
    `"Department of Computer Science & Information Technology"`,
    `"Programme: BS Computer Science","Shift: Evening","Semester: 7th","Session: 2023-27"`,
    `"Course Code: ${course.code}","Course Title: ${course.title}","Credit Hours: ${course.creditHours}","Teacher: ${course.teacher}"`,
    `"Official Strength: 58","Enrolled in Sheet: ${students.length}","Total Lectures Held: ${lectures.length}"`,
    ``,
  ];

  // Table Column Header
  const tableHeaders = ['Sr.', 'Roll No.', 'Student Name'];
  lectures.forEach((lec) => {
    tableHeaders.push(`"${lec.displayDate} (${lec.date})"`);
  });
  tableHeaders.push('P (Presents)', 'A (Absents)', 'Total Lectures', 'Attendance %');

  const rows: string[] = [headerLines.join('\n'), tableHeaders.join(',')];

  students.forEach((student) => {
    const rowCells: (string | number)[] = [student.sr, `"${student.rollNo}"`, `"${student.name}"`];

    let pCount = 0;
    let aCount = 0;

    lectures.forEach((lec) => {
      const status = lec.records[student.rollNo] || 'P';
      rowCells.push(`"${status}"`);
      if (status === 'P') pCount++;
      else aCount++;
    });

    const total = lectures.length;
    const pct = total > 0 ? Math.round((pCount / total) * 100) : 100;

    rowCells.push(pCount, aCount, total, `"${pct}%"`);
    rows.push(rowCells.join(','));
  });

  return rows.join('\n');
}

export function downloadFile(content: string, filename: string, type = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
