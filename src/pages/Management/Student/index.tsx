import { DocumentData } from "firebase/firestore";
import { loadUser } from "../../../utils/loadUser";
import { useState } from "react";

const StudentManagement = () => {
  const [data, setData] = useState<DocumentData[]>([]);
  const handleClick = async () => {
    const studentList = await loadUser("student");
    if (studentList) {
      setData(studentList);
    }
  };
  return (
    <>
      <h3>Student Management</h3>
      <button onClick={handleClick}>Load Student list</button>
      {data && (
        <>
          {data.map((item) => {
            return (
              <div key={item.uid}>
                <p>{item.name}</p>
                <p>{item.email}</p>
                <img style={{ width: 150 }} src={item.image} />
              </div>
            );
          })}
        </>
      )}
    </>
  );
};

export default StudentManagement;
