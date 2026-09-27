import type { Course, Student, CourseAttendance } from '../types/attendance';

export const UNIVERSITY_INFO = {
  institution: 'Emerson University Multan',
  department: 'Department of Computer Science & Information Technology',
  programme: 'BS Computer Science',
  shift: 'Evening Shift',
  semester: '7th Semester',
  session: '2023-27',
  officialStrength: 58,
  academicTerm: 'Fall 2026 (September - December)',
};

export const OFFICIAL_COURSES: Course[] = [
  {
    id: 'cosc-4113',
    code: 'COSC-4113',
    title: 'Analysis of Algorithms',
    creditHours: '3+0',
    teacher: 'Qasim Niaz',
    color: '#7A1F1F',
    icon: 'BrainCircuit',
  },
  {
    id: 'cose-4135',
    code: 'COSE-4135',
    title: 'Compiler Construction',
    creditHours: '2+1',
    teacher: 'Ayesha BiBi',
    color: '#1C5C34',
    icon: 'Cpu',
  },
  {
    id: 'cose-4150',
    code: 'COSE-4150',
    title: 'Computer Graphics',
    creditHours: '2+1',
    teacher: 'Maryem Ismail',
    color: '#8A3B14',
    icon: 'Palette',
  },
  {
    id: 'cose-4146-th',
    code: 'COSE-4146',
    title: 'Cyber Security (Theory)',
    creditHours: '2+0',
    teacher: 'Samra Mushtaq',
    color: '#1E3A8A',
    icon: 'ShieldAlert',
  },
  {
    id: 'cose-4146-lab',
    code: 'COSE-4146 (Lab)',
    title: 'Cyber Security (Lab)',
    creditHours: '0+1',
    teacher: 'Samra Mushtaq',
    isLab: true,
    color: '#0F766E',
    icon: 'Terminal',
  },
  {
    id: 'flng-41xx',
    code: 'FLNG-41xx',
    title: 'Foreign Language',
    creditHours: '3+0',
    teacher: 'Faculty Assigned',
    color: '#6D28D9',
    icon: 'Languages',
  },
  {
    id: 'arab-4101',
    code: 'ARAB-4101',
    title: 'Translation of the Holy Quran-V',
    creditHours: '3+0',
    teacher: 'Faculty Assigned',
    color: '#047857',
    icon: 'BookOpen',
  },
];

export const OFFICIAL_STUDENTS: Student[] = [
  { id: '1', sr: 1, rollNo: 'COSC231122101', name: 'Muhammad Mujtaba Baig' },
  { id: '2', sr: 2, rollNo: 'COSC231122102', name: 'Muhammad Ajmal' },
  { id: '3', sr: 3, rollNo: 'COSC231122104', name: 'Mueeza Yaqoob Khar' },
  { id: '4', sr: 4, rollNo: 'COSC231122105', name: 'Muneeb ur Rehman' },
  { id: '5', sr: 5, rollNo: 'COSC231122107', name: 'Syed Kumail Haider Zaidi' },
  { id: '6', sr: 6, rollNo: 'COSC231122109', name: 'Anam Gulzar' },
  { id: '7', sr: 7, rollNo: 'COSC231122111', name: 'Hamad Jamil' },
  { id: '8', sr: 8, rollNo: 'COSC231122112', name: 'Muhammad Ikramullah' },
  { id: '9', sr: 9, rollNo: 'COSC231122113', name: 'Sami Ullah' },
  { id: '10', sr: 10, rollNo: 'COSC231122114', name: 'Syed Asad Ali Raza Shah' },
  { id: '11', sr: 11, rollNo: 'COSC231122115', name: 'Abdullah Zahoor' },
  { id: '12', sr: 12, rollNo: 'COSC231122117', name: 'Mubashir Umar' },
  { id: '13', sr: 13, rollNo: 'COSC231122118', name: 'Muhammad Adnan' },
  { id: '14', sr: 14, rollNo: 'COSC231122119', name: 'Muhammad Salman Qadir' },
  { id: '15', sr: 15, rollNo: 'COSC231122120', name: 'Huzaifa Inam' },
  { id: '16', sr: 16, rollNo: 'COSC231122122', name: 'Muhammad Aqeel' },
  { id: '17', sr: 17, rollNo: 'COSC231122123', name: 'Muhammad Hamraz' },
  { id: '18', sr: 18, rollNo: 'COSC231122124', name: 'Maryam Ishfaq' },
  { id: '19', sr: 19, rollNo: 'COSC231122125', name: 'Areeba Ikram' },
  { id: '20', sr: 20, rollNo: 'COSC231122126', name: 'Saad Saddique' },
  { id: '21', sr: 21, rollNo: 'COSC231122127', name: 'Irej Arshad' },
  { id: '22', sr: 22, rollNo: 'COSC231122128', name: 'Muhammad Huzaifa' },
  { id: '23', sr: 23, rollNo: 'COSC231122129', name: 'Muqaddas Bibi' },
  { id: '24', sr: 24, rollNo: 'COSC231122130', name: 'Abdul Rauf' },
  { id: '25', sr: 25, rollNo: 'COSC231122131', name: 'Zubair Hussain' },
  { id: '26', sr: 26, rollNo: 'COSC231122132', name: 'Muhammad Shazaib Rizwan' },
  { id: '27', sr: 27, rollNo: 'COSC231122133', name: 'Muhammad Yaqoob' },
  { id: '28', sr: 28, rollNo: 'COSC231122134', name: 'Muhammad Amman' },
  { id: '29', sr: 29, rollNo: 'COSC231122135', name: 'Areesh Farhat' },
  { id: '30', sr: 30, rollNo: 'COSC231122136', name: 'Yasam Ali' },
  { id: '31', sr: 31, rollNo: 'COSC231122137', name: 'Aown Raza' },
  { id: '32', sr: 32, rollNo: 'COSC231122138', name: 'Nida Akram' },
  { id: '33', sr: 33, rollNo: 'COSC231122139', name: 'Muhamamd Zohaib' },
  { id: '34', sr: 34, rollNo: 'COSC231122140', name: 'Muhammad Usman Ahmad' },
  { id: '35', sr: 35, rollNo: 'COSC231122141', name: 'Abdullah Farooq' },
  { id: '36', sr: 36, rollNo: 'COSC231122142', name: 'Muhammad Awais' },
  { id: '37', sr: 37, rollNo: 'COSC231122143', name: 'Asma Khalid' },
  { id: '38', sr: 38, rollNo: 'COSC231122144', name: 'Zainab Naveed' },
  { id: '39', sr: 39, rollNo: 'COSC231122145', name: 'Muhammad Nafil Azam' },
  { id: '40', sr: 40, rollNo: 'COSC231122146', name: 'Muhammad Faheem Saeed' },
  { id: '41', sr: 41, rollNo: 'COSC231122147', name: 'Usman Shukoor' },
  { id: '42', sr: 42, rollNo: 'COSC231122148', name: 'Muhammad Kashif' },
  { id: '43', sr: 43, rollNo: 'COSC231122149', name: 'Muhammad Azwar' },
  { id: '44', sr: 44, rollNo: 'COSC231122150', name: 'Hammad Zaheer' },
  { id: '45', sr: 51, rollNo: 'COSC231122151', name: 'Muhammad Khawar Shahzad' },
  { id: '46', sr: 52, rollNo: 'COSC231122152', name: 'Syed Ali Naqi Zaidi' },
  { id: '47', sr: 53, rollNo: 'COSC231122154', name: 'Awais Mazhar' },
  { id: '48', sr: 54, rollNo: 'COSC231122155', name: 'Muhammad Sharjeel' },
  { id: '49', sr: 55, rollNo: 'COSC231122156', name: 'Mubashir Mehmood' },
  { id: '50', sr: 56, rollNo: 'COSC231122157', name: 'Muhammad Abdullah' },
  { id: '51', sr: 57, rollNo: 'COSC231122159', name: 'Muhammad Hasnain' },
  { id: '52', sr: 58, rollNo: 'COSC231122161', name: 'Muhammad Mubeen' },
];

// Helper to generate formatted display date like "07/09/2026" from "2026-09-07"
export function formatDisplayDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    return `${dayStr}/${monthStr}/${year}`;
  } catch {
    return dateStr;
  }
}

// Generate pre-seeded sample lectures for authentic initial portal experience
function generateSeedAttendance(): Record<string, CourseAttendance> {
  const seedDates = ['2026-09-07', '2026-09-09', '2026-09-14', '2026-09-16', '2026-09-21', '2026-09-23'];
  const attendanceMap: Record<string, CourseAttendance> = {};

  OFFICIAL_COURSES.forEach((course, courseIdx) => {
    // Cyber Lab might meet once a week, others twice
    const dates = course.isLab ? ['2026-09-09', '2026-09-16', '2026-09-23'] : seedDates;

    const lectures = dates.map((dateStr, idx) => {
      const records: Record<string, 'P' | 'A'> = {};

      OFFICIAL_STUDENTS.forEach((student, sIdx) => {
        // High attendance realism: most are P, a few random A
        const hash = (sIdx * 17 + courseIdx * 31 + idx * 7) % 100;
        records[student.rollNo] = hash > 88 ? 'A' : 'P';
      });

      return {
        id: `lec-${course.id}-${dateStr}-${idx}`,
        date: dateStr,
        displayDate: formatDisplayDate(dateStr),
        topic: `Lecture ${idx + 1}: Introduction & Key Concepts`,
        records,
        createdAt: new Date(`${dateStr}T10:00:00Z`).toISOString(),
      };
    });

    attendanceMap[course.id] = {
      courseId: course.id,
      lectures,
    };
  });

  return attendanceMap;
}

export const INITIAL_ATTENDANCE_DATA = generateSeedAttendance();
export const DEFAULT_MASTER_PASSWORD = 'emu2026';
