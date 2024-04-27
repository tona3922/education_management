/* eslint-disable react-hooks/rules-of-hooks */
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { loadUser } from "../../../utils/loadUser";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { setGrade } from "./setGrade";
import { db } from "../../../firebase";
import { setGPA } from "./components/setGPA";
import { Link } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { uuidv4 } from "../../../utils/common";
import { ECourseDocumentType, updateCourseDocument } from "./updateCourse";

const StudentManagement = () => {
  const [students, setData] = useState<DocumentData[]>([]);
  const [listStudents, setListStudents] = useState<any>(null);
  const [courseSelected, setCourseSelected] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documentUploadType, setDocumentUploadType] =
    useState<ECourseDocumentType>(ECourseDocumentType.FILE);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const scoreCount = 10;
  const midtermScoreStates = Array.from({ length: scoreCount }, () =>
    useState<number>(0)
  );
  const finalScoreStates = Array.from({ length: scoreCount }, () =>
    useState<number>(0)
  );

  let count = 0;
  useEffect(() => {
    const fetchData = async () => {
      const studentList = await loadUser("student");
      if (studentList) {
        setData(studentList);
      }
    };
    fetchData();
  }, []);

  const getListStudent = async (currentUserId: string) => {
    const docRef = doc(db, "users", currentUserId);
    const docSnap = await getDoc(docRef);
    const listStudentsData = await docSnap.data()?.listStudents;
    const resultMap: any = {};
    Object.keys(listStudentsData).forEach((courseCode) => {
      const studentIds = listStudentsData[courseCode];
      studentIds.forEach((studentId: any) => {
        const foundStudent = students.find(
          (student) => student.uid === studentId
        );
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
    setGPA(studentId);
  };
  const currentUserId = localStorage.getItem("userId");

  const onUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    // Get the file from the upload event
    const file = e.target.files?.[0];

    if (!file || !courseSelected) return;

    try {
      setIsUploading(true);
      const splitFileName = file.name.split(".");

      const fileName =
        splitFileName[0] + "_" + uuidv4() + "." + splitFileName[1];

      // Get a reference to Firebase storage
      const storage = getStorage();
      const storageRef = ref(storage, fileName);
      const res = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(res.ref);
      
      // Create new document data
      const documentData = {
        id: uuidv4(),
        name: file.name,
        content: url,
        type: documentUploadType,
      };

      await updateCourseDocument(courseSelected, documentData);
      alert("Upload document successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
      inputFileRef.current && (inputFileRef.current.value = "");
    }
  };

  const onClickUploadBtn = async (courseCode: string) => {
    // Save the selected course code to the state
    setCourseSelected(courseCode);
    const type = prompt("Enter you document type (FILE, VIDEO, NOTIFICATION)");
    const typeFormatted = type?.toUpperCase() as ECourseDocumentType;
    
    // Check if the entered document type is valid
    if (
      !typeFormatted ||
      ![
        ECourseDocumentType.FILE,
        ECourseDocumentType.NOTIFICATION,
        ECourseDocumentType.VIDEO,
      ].includes(typeFormatted)
    ) {
      return;
    }

    setDocumentUploadType(typeFormatted);

    if (typeFormatted === ECourseDocumentType.NOTIFICATION) {
      const notificationContent = prompt("Enter your notification:");
      if (!notificationContent) return;

      setIsUploading(true);

      const documentData = {
        id: uuidv4(),
        content: notificationContent,
        type: typeFormatted,
      };

      await updateCourseDocument(courseCode, documentData);

      setIsUploading(false);
      alert("Upload document successfully");
    } else {
      if (isUploading || !inputFileRef.current) return;
      inputFileRef.current.accept =
        typeFormatted === ECourseDocumentType.FILE ? ".pdf" : ".mp4";
      inputFileRef.current.click();
    }
  };

  return (
    <>
      <h3>Student Management</h3>
      {currentUserId && (
        <button onClick={() => getListStudent(currentUserId)}>
          Load Student list
        </button>
      )}
      {listStudents && (
        <>
          {Object.keys(listStudents).map((courseCode) => (
            <div key={courseCode}>
              <Link to={`/course/${courseCode}`}>
                <h4>Course: {courseCode}</h4>
              </Link>

              <button onClick={() => onClickUploadBtn(courseCode)}>
                {isUploading ? "Uploading..." : "Upload document"}
              </button>

              {listStudents[courseCode].map((student: any) => {
                const [midtermScore, setMidtermScore] =
                  midtermScoreStates[count];
                const [finalScore, setFinalScore] = finalScoreStates[count];
                count++;
                return (
                  <div key={student.uid}>
                    <p>{student.name}</p>
                    <p>{student.email}</p>
                    <img
                      style={{ width: 150 }}
                      src={student.image}
                      alt="Student"
                    />{" "}
                    <br />
                    <br />
                    <div>
                      {" "}
                      Current midterm score:{" "}
                      {student.listCourses[courseCode].midterm}
                    </div>
                    <input
                      type="number"
                      value={midtermScore}
                      onChange={(event) =>
                        setMidtermScore(parseFloat(event.target.value))
                      }
                      placeholder="Enter new midterm score"
                    />
                    <br />
                    <div>
                      {" "}
                      Current final score:{" "}
                      {student.listCourses[courseCode].final}
                    </div>
                    <input
                      type="number"
                      value={finalScore}
                      onChange={(event) =>
                        setFinalScore(parseFloat(event.target.value))
                      }
                      placeholder="Enter new final score"
                    />
                    <br />
                    <div>
                      {" "}
                      Average score: {student.listCourses[courseCode].average}
                    </div>
                    <button
                      onClick={() => {
                        handleSetGrade(
                          midtermScore,
                          finalScore,
                          student.uid,
                          courseCode
                        );
                      }}
                    >
                      Set Grade
                    </button>
                    <div>-------------------------------------------------</div>
                  </div>
                );
              })}
            </div>
          ))}
        </>
      )}

      <input
        type="file"
        name=""
        id=""
        hidden
        ref={inputFileRef}
        onChange={onUploadFile}
      />
    </>
  );
};

export default StudentManagement;
