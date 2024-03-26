import { useState } from 'react';
import { students, courses, enrollments } from './DummyData';

export const useQueryLogic = () => {
  const [data, setData] = useState([]);

  const handleSubmitQuery = (comparisonType) => {
    let comparisonData = [];
    switch (comparisonType) {
      case 'courseCredits':
        // Compare courses based on their credits
        comparisonData = compareCoursesByCredits();
        break;
      case 'studentCountByGender':
        // Compare the count of students by gender
        comparisonData = compareStudentsByGender();
        break;
        case 'lecturerCoursesCount':
          // Compare the count of courses taught by each lecturer
          comparisonData = compareLecturerCoursesCount();
          break;
        case 'courseEnrollmentCount':
          // Compare the count of students enrolled in each course
          comparisonData = compareCourseEnrollmentCount();
          break;
      default:
        // Default to empty data if no comparison type specified
        comparisonData = [];
    }
    setData(comparisonData);
  };

  const compareCoursesByCredits = () => {
    // Group courses by credits and count the number of courses with each credit value
    const creditCounts = courses.reduce((counts, course) => {
      counts[course.credits] = (counts[course.credits] || 0) + 1;
      return counts;
    }, {});

    // Convert credit counts to comparison data format
    const comparisonData = Object.entries(creditCounts).map(([credits, count]) => ({
      label: `${credits} credits`,
      value: count
    }));

    return comparisonData;
  };

  const compareStudentsByGender = () => {
    // Group students by gender and count the number of students in each gender
    const genderCounts = students.reduce((counts, student) => {
      counts[student.gender] = (counts[student.gender] || 0) + 1;
      return counts;
    }, {});

    // Convert gender counts to comparison data format
    const comparisonData = Object.entries(genderCounts).map(([gender, count]) => ({
      label: gender,
      value: count
    }));

    return comparisonData;
  };

  const compareLecturerCoursesCount = () => {
    // Group courses by lecturer and count the number of courses taught by each lecturer
    const lecturerCounts = courses.reduce((counts, course) => {
      counts[course.Lecturer] = (counts[course.Lecturer] || 0) + 1;
      return counts;
    }, {});

    // Convert lecturer counts to comparison data format
    const comparisonData = Object.entries(lecturerCounts).map(([lecturer, count]) => ({
      label: lecturer,
      value: count
    }));

    return comparisonData;
  };

  const compareCourseEnrollmentCount = () => {
    // Group enrollments by course and count the number of students enrolled in each course
    const enrollmentCounts = courses.map(course => ({
      label: course.name,
      value: enrollments.filter(enrollment => enrollment.courseId === course.id).length
    }));

    return enrollmentCounts;
  };

  

  return { data, handleSubmitQuery };
};

