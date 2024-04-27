import { useState, useContext } from "react";
import { loadCourse } from "../hooks/loadCourse";
import { DocumentData } from "firebase/firestore";
import { registerCourse } from "../hooks/registerCourse";
import { AuthContext } from "../../../context/AuthContext";
import { loadUser } from "../../../utils/loadUser";
import { Link } from "react-router-dom";

import styles from "../index.module.css";

const LoadCourseButton: React.FC<{
  courseCode: string;
  userId: string;
  studentId: string;
  role: string;
}> = ({ courseCode, userId, studentId, role }) => {
  // const isStudentRegistered = checkStudentList(courseCode, userId);
  return (
    <>
      {(() => {
        switch (role) {
          case "student":
            return (
              <>
                {role ? (
                  <button
                    onClick={() =>
                      registerCourse(courseCode, userId, studentId)
                    }
                  >
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
  const currentUser = useContext(AuthContext);
  const [courses, setCourses] = useState<DocumentData[]>([]);
  const [teachers, setTeacher] = useState<DocumentData[]>([]);

  const handleLoadCourse = async () => {
    const AllCourse = await loadCourse();
    if (AllCourse) {
      setCourses(AllCourse);
    }
    const teacherList = await loadUser("teacher");
    if (teacherList) {
      setTeacher(teacherList);
    }
  };
  const handleRegister = (course: DocumentData) => {
    let teacherId = "";
    teachers.map((teacher) => {
      if (course.teacher === teacher.name) {
        teacherId = teacher.uid;
      }
    });
    if (currentUser) {
      registerCourse(course.courseCode, teacherId, currentUser?.uid);
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
                <div>
                  <Link to={`/course/${course.courseCode}`}>
                    <h4 className={styles.courseName}>{course.courseName}</h4>
                  </Link>
                </div>
                <span>
                  <b>Lecturer:</b> {course.teacher}
                </span>
                {role === "student" ? (
                  <button onClick={() => handleRegister(course)}>
                    Register
                  </button>
                ) : (
                  <></>
                )}
                <div>
                  --------------------------------------------------------
                </div>
                {role && userId && (
                  <LoadCourseButton
                    courseCode={course.courseCode}
                    role={role}
                    userId={userId}
                    studentId=""
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
