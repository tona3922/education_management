import { DocumentData } from "firebase/firestore";
import { loadUser } from "../../../utils/loadUser";
import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { setGrade } from "./setGrade";

const StudentManagement = () => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [teachers, setTeacher] = useState<DocumentData[]>([]);
  const currentUser = useContext(AuthContext);
  const handleClick = async () => {
    const studentList = await loadUser("student");
    if (studentList) {
      setData(studentList);
    }
    const teacherList = await loadUser("teacher");
    if (teacherList) {
      setTeacher(teacherList);
    }
  };
  const getListStudents = () => {
    let listStudents;
    teachers.map((teacher) => {
      if (teacher.uid === currentUser.uid && teacher.listStudents) {
        listStudents = teacher.listStudents;
      }
    });
    let students = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < listStudents.length; j++) {
        if (listStudents[j] === data[i].uid) {
          students.push(data[i]);
        }
      }
    }
    return students;
  };
  const listStudents = getListStudents();

  const handleSetGrade = () => {
    setGrade();
    //console.table(listStudents);
  };

  return (
    <>
      <h3>Student Management</h3>
      <button onClick={() => handleClick()}>Load Student list</button>

      {listStudents && (
        <>
          {listStudents.map((item) => {
            return (
              <div key={item.uid}>
                <p>{item.name}</p>
                <p>{item.email}</p>
                <img style={{ width: 150 }} src={item.image} /> <br />
                <button onClick={() => handleSetGrade()}>Set Grade</button>
                <div>-------------------------------------------------</div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default StudentManagement;
