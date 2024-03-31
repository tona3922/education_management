import { DocumentData } from "firebase/firestore";
import { loadUser } from "../../../utils/loadUser";
import { useState } from "react";
const TeacherManagement = () => {
  const [data, setData] = useState<DocumentData[]>([]);
  const handleClick = async () => {
    const teacherList = await loadUser("teacher");
    if (teacherList) {
      setData(teacherList);
    }
  };
  return (
    <>
      <h3>Teacher Management</h3>
      <button onClick={handleClick}>Load Teacher list</button>
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

export default TeacherManagement;
