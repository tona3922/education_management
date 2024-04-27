import {
    DocumentData,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import { db } from "../../../firebase";
  
  export const getCourse = async (courseCode: string) => {
    let course = null;
  
    // Lấy course detail bằng courseCode
    const courseRef = doc(db, "courses", courseCode);
    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      course = courseDoc.data();
    }
  
    // Lấy danh sách học sinh đki trong khóa học
    if (course && course.studentRegister) {
      let studentRegister: DocumentData[] = [];
      const queryGetStudent = query(
        collection(db, "users"),
        where("uid", "in", course.studentRegister)
      );
  
      const queryStudentSnapshot = await getDocs(queryGetStudent);
      queryStudentSnapshot.forEach((doc) => {
        studentRegister.push(doc.data());
      });
  
      course.studentRegister = studentRegister;
    }
  
    return course;
  };
  