import { useState } from "react";
import { loadCourse } from "../hooks/loadCourse";
import { DocumentData } from "firebase/firestore";

const LoadCourse = () => {
  const [courses, setCourses] = useState<DocumentData[]>([]);
  const handleLoadCourse = async () => {
    const AllCourse = await loadCourse();
    if (AllCourse) {
      setCourses(AllCourse);
    }
  };
  return (
    <>
      <button onClick={handleLoadCourse}>Load all course</button>
      {courses && (
        <>
          {courses.map((course) => {
            return (
              <div key={course.courseCode}>
                <span>
                  code: {course.courseCode} - credit: {course.credit}
                </span>
                <h4>{course.courseName}</h4>
                <p>{course.schedule}</p>
                <span>
                  <b>Lecturer:</b> {course.teacher}
                </span>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default LoadCourse;
