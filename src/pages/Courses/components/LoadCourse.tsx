import { useState } from "react";
import { loadCourse } from "../hooks/loadCourse";
import { DocumentData } from "firebase/firestore";
import { registerCourse } from "../hooks/registerCourse";
const LoadCourseButton: React.FC<{
  courseCode: string;
  userId: string;
  role: string;
}> = ({ courseCode, userId, role }) => {
  // const isStudentRegistered = checkStudentList(courseCode, userId);
  return (
    <>
      {(() => {
        switch (role) {
          case "student":
            return (
              <>
                {role ? (
                  <button onClick={() => registerCourse(courseCode, userId)}>
                    Register
                  </button>
                ) : (
                  <button>Already Learnt</button>
                )}
              </>
            );

          case "teacher":
            return <p className="success">Connected Successfully!</p>;
          case "admin":
            return <p className="success">Connected Successfully!</p>;

          default:
            return null;
        }
      })()}
    </>
  );
};
const LoadCourse = () => {
  const [courses, setCourses] = useState<DocumentData[]>([]);
  const handleLoadCourse = async () => {
    const AllCourse = await loadCourse();
    if (AllCourse) {
      setCourses(AllCourse);
    }
  };
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
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
                {role && userId && (
                  <LoadCourseButton
                    courseCode={course.courseCode}
                    role={role}
                    userId={userId}
                  />
                )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default LoadCourse;
