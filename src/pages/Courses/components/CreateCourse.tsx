import { FormEvent, useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { loadUser } from "../../../utils/loadUser";
import { createCourse } from "../hooks/createCourse";

const CreateCourse = () => {
  const [form, setForm] = useState({
    courseName: "",
    courseCode: "",
    schedule: "",
    credit: "",
    teacher: "",
  });
  const [data, setData] = useState<DocumentData[]>([]);
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
  const createNewCourse = (e: React.SyntheticEvent) => {
    e.preventDefault();
    createCourse(e);
    setForm({
      courseName: "",
      courseCode: "",
      schedule: "",
      credit: "",
      teacher: "",
    });
  };
  return (
    <>
      <h3>Course</h3>
      <form onSubmit={createNewCourse}>
        <h3>Create new account</h3>
        <input
          type="text"
          placeholder="Enter your course name"
          name="courseName"
          value={form.courseName}
          onChange={handleChange}
        ></input>
        <input
          type="text"
          name="courseCode"
          placeholder="Enter your course code"
          value={form.courseCode}
          onChange={handleChange}
        ></input>
        <input
          type="text"
          name="schedule"
          placeholder="Enter your course schedule"
          onChange={handleChange}
          value={form.schedule}
        ></input>
        {data && (
          <select
            name="teacher"
            id="teacher"
            onChange={handleChange}
            value={form.teacher}
          >
            <option disabled value={""}>
              -- select teacher --
            </option>
            {data.map((teacher) => {
              return (
                <option value={teacher.name} key={teacher.uid}>
                  {teacher.name}
                </option>
              );
            })}
          </select>
        )}
        <select
          name="credit"
          id="credit"
          onChange={handleChange}
          value={form.credit}
        >
          <option disabled value={""}>
            -- select credit number --
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <button type="submit">Create new course</button>
      </form>
    </>
  );
};

export default CreateCourse;
