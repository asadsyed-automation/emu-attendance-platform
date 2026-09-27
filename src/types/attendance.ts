export type AttendanceStatus = 'P' | 'A';

export interface Student {
  id: string;
  sr: number;
  rollNo: string;
  name: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditHours: string;
  teacher: string;
  isLab?: boolean;
  color?: string;
  icon?: string;
}

export interface Lecture {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  displayDate: string; // e.g. "07 Sep"
  topic?: string;
  records: Record<string, AttendanceStatus>; // rollNo -> 'P' | 'A'
  createdAt: string;
}

export interface CourseAttendance {
  courseId: string;
  lectures: Lecture[];
}

export interface StudentCourseStats {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  creditHours: string;
  teacher: string;
  isLab?: boolean;
  presents: number;
  absents: number;
  total: number;
  percentage: number;
  eligible: boolean;
}

export interface StudentOverallReport {
  student: Student;
  courses: StudentCourseStats[];
  totalPresents: number;
  totalAbsents: number;
  totalLectures: number;
  averagePercentage: number;
  shortAttendanceCourses: number;
}
