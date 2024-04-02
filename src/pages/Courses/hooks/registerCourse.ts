import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export const registerCourse = async (courseCode: string, studentId: string) => {
  await updateDoc(doc(db, "courses", courseCode), {
    courseCode: courseCode,
    studentRegister: studentId,
  });
};
