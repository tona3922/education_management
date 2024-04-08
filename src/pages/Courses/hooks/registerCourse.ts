import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../firebase";

export const registerCourse = async (
  courseCode: string,
  teacherId: string,
  studentId: string
) => {
  await updateDoc(doc(db, "courses", courseCode), {
    studentRegister: arrayUnion(studentId),
  });
  await updateDoc(doc(db, "users", studentId), {
    listCourses: arrayUnion(courseCode),
  });
  await updateDoc(doc(db, "users", teacherId), {
    listStudents: arrayUnion(studentId),
  });
  alert("Registered successfully");
};
