import { DocumentData, doc, getDoc } from "firebase/firestore";
import { loadUser } from "../../../utils/loadUser";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { setGrade } from "./setGrade";
import { db } from "../../../firebase";

const StudentManagement = () => {
  const [students, setData] = useState<DocumentData[]>([]);
  const [listStudents, setListStudents] = useState<any>(null); 
  const currentUser = useContext(AuthContext);
  const scoreCount = 10;
  const midtermScoreStates = Array.from({ length: scoreCount }, () => useState<number>(0));
  const finalScoreStates = Array.from({ length: scoreCount }, () => useState<number>(0));
  let count = 0
  useEffect(() => {
    const fetchData = async () => {
      const studentList = await loadUser("student");
      if (studentList) {
        setData(studentList);
      }
    };
    fetchData();
  }, []);

  const getListStudent = async () => {
    const docRef = doc(db, "users", currentUser?.uid);
    const docSnap = await getDoc(docRef);
    const listStudentsData = await docSnap.data().listStudents;
    let resultMap: any = {};
    Object.keys(listStudentsData).forEach((courseCode) => {
      const studentIds = listStudentsData[courseCode];
      studentIds.forEach((studentId: any) => {
        const foundStudent = students.find(student => student.uid === studentId);
        if (foundStudent) {
          if (!resultMap[courseCode]) {
            resultMap[courseCode] = [foundStudent];
          } else {
            resultMap[courseCode].push(foundStudent);
          }
        }
      });
    });
    setListStudents(resultMap);
  };

  const handleSetGrade = (
    midleScore: number,
    finalScore: number,
    studentId: string,
    courseCode: string
  ) => {
    setGrade(midleScore, finalScore, studentId, courseCode);
  };

  return (
    <>
      <h3>Student Management</h3>
      <button onClick={getListStudent}>
        Load Student list
      </button>
      {listStudents && (
        <>
          {Object.keys(listStudents).map((courseCode) => (
            <div key={courseCode}>
              <h4>Course: {courseCode}</h4>
              {listStudents[courseCode].map((student: any) => {
                const [midtermScore, setMidtermScore] = midtermScoreStates[count];
                const [finalScore, setFinalScore] = finalScoreStates[count];
                count++
                return (
                  <div key={student.uid}>
                    <p>{student.name}</p>
                    <p>{student.email}</p>
                    <img style={{ width: 150 }} src={student.image} alt="Student" /> <br />
                    <br />
                    <div> Current midterm score: {student.listCourses[courseCode].midterm}</div>
                    <input
                      type="number"
                      value={midtermScore}
                      onChange={(event) =>
                        setMidtermScore(parseFloat(event.target.value))
                      }
                      placeholder="Enter new midterm score"
                    />
                    <br />
                    <div> Current final score: {student.listCourses[courseCode].final}</div>
                    <input
                      type="number"
                      value={finalScore}
                      onChange={(event) =>
                        setFinalScore(parseFloat(event.target.value))
                      }
                      placeholder="Enter new final score"
                    />
                    <br />
                    <div> Average score: {student.listCourses[courseCode].average}</div>
                    <button
                      onClick={() => {
                        handleSetGrade(
                          midtermScore,
                          finalScore,
                          student.uid,
                          courseCode
                        )
                      }}
                    >
                      Set Grade
                    </button>
                    <div>-------------------------------------------------</div>
                  </div>
                )
              })}
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default StudentManagement;
