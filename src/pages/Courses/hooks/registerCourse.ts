import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
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
    [`listCourses.${courseCode}`]: {
      midterm: 0,
      final: 0,
      average: 0,
    },
  });
  const teacherRef = doc(db, "users", teacherId);
  const teacherDoc = await getDoc(teacherRef);
  if (teacherDoc.exists()) {
    const listStudents = teacherDoc.data().listStudents || {};
    const updatedListStudents = { ...listStudents };
    if (updatedListStudents[courseCode]) {
      updatedListStudents[courseCode] = [...updatedListStudents[courseCode], studentId];
    } else {
      updatedListStudents[courseCode] = [studentId];
    }
    await updateDoc(doc(db, "users", teacherId), {
      listStudents: updatedListStudents
    });
  }
  alert("Registered successfully");
};
