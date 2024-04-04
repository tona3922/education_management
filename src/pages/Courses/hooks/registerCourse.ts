import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
export const checkStudentList = async (
  courseCode: string,
  studentId: string
) => {
  const docRef = doc(db, "courses", courseCode);
  const docSnap = await getDoc(docRef);
  // console.log("Document data:", docSnap.data());
  const studentList: string[] = docSnap.data()?.registeredStudent; // checked -> chi can check xem co student hay chua
  if (studentList && studentList.includes(studentId)) {
    return true;
  }
  return false;
};
export const registerCourse = async (courseCode: string, studentId: string) => {
  const docRef = doc(db, "courses", courseCode);
  const docSnap = await getDoc(docRef);
  console.log("Document data:", docSnap.data());
  const studentList: string[] = docSnap.data()?.registeredStudent;
  const registeredStudent: boolean = await checkStudentList(
    courseCode,
    studentId
  );
  if (!registeredStudent) {
    studentList.push(studentId);
  }
  await updateDoc(doc(db, "courses", courseCode), {
    courseCode: courseCode,
    studentRegister: studentList,
  });
};
