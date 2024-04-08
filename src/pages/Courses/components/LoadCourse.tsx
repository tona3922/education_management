import { useState, useContext } from "react";
import { loadCourse } from "../hooks/loadCourse";
import { DocumentData } from "firebase/firestore";
import { registerCourse } from "../hooks/registerCourse";
import { AuthContext } from "../../../context/AuthContext";
import { loadUser } from "../../../utils/loadUser";


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
    let teacherId = ""
    teachers.map((teacher) => {
      if(course.teacher === teacher.name) {
        teacherId = teacher.uid
      }
    })
    registerCourse(course.courseCode, teacherId, currentUser.uid)

  }
  const role = localStorage.getItem("role");
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
                {role === "student" ? <button onClick={() => handleRegister(course)}>Register</button> : <></>}
                <div>--------------------------------------------------------</div>
              </div>
            );
          })}
        </>

      )}
    </>
  );
};

export default LoadCourse;
