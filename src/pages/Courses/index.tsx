import { FormEvent, useEffect, useState } from "react";
import { createCourse } from "./createCourse";
import { loadUser } from "../../utils/loadUser";
import { DocumentData } from "firebase/firestore";
import { loadCourse } from "../../utils/loadCourse";

const CreateCourse = () => {
  const [, setForm] = useState({
    courseName: "",
    courseCode: "",
    schedule: "",
    credit: "",
    teacher: "",
  });
  const [data, setData] = useState<DocumentData[]>([]);
  const [courses, setCourses] = useState<DocumentData[]>([]);
  useEffect(() => {
    const loadTeacher = async () => {
      const teacherList = await loadUser("teacher");
      if (teacherList) {
        setData(teacherList);
      }
    };
    loadTeacher();
  }, []);
  const handleChange = (e: FormEvent) => {
    setForm((prev) => ({
      ...prev,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement)
        .value,
    }));
  };
  const handleLoadCourse = async () => {
    const AllCourse = await loadCourse();
    if (AllCourse) {
      setCourses(AllCourse);
    }
  };
  return (
    <>
      <h3>Course</h3>

      <form onSubmit={createCourse}>
        <h3>Create new account</h3>
        <input
          type="text"
          placeholder="Enter your course name"
          name="courseName"
          onChange={handleChange}
        ></input>
        <input
          type="text"
          name="courseCode"
          placeholder="Enter your course code"
          onChange={handleChange}
        ></input>
        <input
          type="text"
          name="schedule"
          placeholder="Enter your course schedule"
          onChange={handleChange}
        ></input>
        {data && (
          <select name="teacher" id="teacher" onChange={handleChange}>
            {data.map((teacher) => {
              return (
                <option value={teacher.name} key={teacher.uid}>
                  {teacher.name}
                </option>
              );
            })}
          </select>
        )}
        <select name="credit" id="credit" onChange={handleChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button type="submit">Create new course</button>
      </form>
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

export default CreateCourse;
