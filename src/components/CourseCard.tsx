import React from 'react';
import type { Course, CourseAttendance } from '../types/attendance';
import { OFFICIAL_STUDENTS } from '../data/initialData';
import { Icons } from './Icons';

interface CourseCardProps {
  course: Course;
  attendanceData?: CourseAttendance;
  isUnlocked: boolean;
  onSelectCourse: (courseId: string) => void;
  onMarkCourseLecture: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  attendanceData,
  isUnlocked,
  onSelectCourse,
  onMarkCourseLecture,
}) => {
  const lectures = attendanceData?.lectures || [];
  const totalLectures = lectures.length;

  // Calculate average attendance percentage across all enrolled students
  let totalPresentsAll = 0;
  let totalPossible = totalLectures * OFFICIAL_STUDENTS.length;

  if (totalPossible > 0) {
    lectures.forEach((lec) => {
      OFFICIAL_STUDENTS.forEach((st) => {
        if (lec.records[st.rollNo] === 'P') {
          totalPresentsAll++;
        }
      });
    });
  }

  const avgAttendance =
    totalPossible > 0 ? Math.round((totalPresentsAll / totalPossible) * 100) : 100;

  return (
    <div className="course-card">
      <div className="course-card-top">
        <div className="course-badge-row">
          <span className={`course-code-tag ${course.isLab ? 'is-lab' : ''}`}>
            {course.code}
          </span>
          <span className="cr-hrs-tag">Cr: {course.creditHours}</span>
        </div>

        <h3 className="course-title">{course.title}</h3>

        <div className="course-teacher">
          <Icons.GraduationCap size={15} style={{ color: 'var(--color-maroon-700)' }} />
          <span>{course.teacher}</span>
        </div>

        <div className="course-metrics-bar">
          <div className="metric-item">
            <span className="metric-label">Lectures Held</span>
            <span className="metric-val">{totalLectures} Days</span>
          </div>
          <div className="metric-item" style={{ textAlign: 'right' }}>
            <span className="metric-label">Class Avg</span>
            <span
              className="metric-val"
              style={{
                color:
                  avgAttendance >= 75
                    ? '#16a34a'
                    : avgAttendance >= 60
                    ? '#d97706'
                    : '#dc2626',
              }}
            >
              {totalLectures > 0 ? `${avgAttendance}%` : 'No Data'}
            </span>
          </div>
        </div>
      </div>

      <div className="course-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onSelectCourse(course.id)}
          style={{ width: '100%' }}
        >
          <Icons.FileSpreadsheet size={15} />
          <span>View Register</span>
        </button>

        {isUnlocked && (
          <button
            type="button"
            className="btn btn-green btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMarkCourseLecture(course.id);
            }}
            title="Mark Attendance for this course"
          >
            <Icons.Plus size={15} />
            <span>Mark</span>
          </button>
        )}
      </div>
    </div>
  );
};
