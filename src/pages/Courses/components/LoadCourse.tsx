import { useState, useContext } from "react";
import { loadCourse } from "../hooks/loadCourse";
import { DocumentData } from "firebase/firestore";
import { registerCourse } from "../hooks/registerCourse";
import { AuthContext } from "../../../context/AuthContext";



const LoadCourse = () => {
  const [courses, setCourses] = useState<DocumentData[]>([]);
  const handleLoadCourse = async () => {
    const AllCourse = await loadCourse();
    if (AllCourse) {
      setCourses(AllCourse);
    }
  };


  const currentUser = useContext(AuthContext);
  //console.log(">>>check current id:", typeof currentUser.uid)
  const handleRegister = (course) => {
    registerCourse(course.courseCode, currentUser.uid)
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
