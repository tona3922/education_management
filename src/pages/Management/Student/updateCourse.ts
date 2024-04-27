import {
    DocumentData,
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
  } from "firebase/firestore";
  import { db } from "../../../firebase";
  
  export enum ECourseDocumentType {
    FILE = "FILE",
    VIDEO = "VIDEO",
    NOTIFICATION = "NOTIFICATION",
  }
  
  // Update course document in the database
  export const updateCourseDocument = async (
    courseCode: string,
    documentData: any
  ) => {
    const courseRef = doc(db, "courses", courseCode);
    await updateDoc(courseRef, {
      courseDocuments: arrayUnion(documentData),
    });
  };
  
  // Remove course document from the database
  export const removeCourseDocument = async (
    courseCode: string,
    documentId: string
  ) => {
    const courseRef = doc(db, "courses", courseCode);
    const courseDoc = await getDoc(courseRef);
  
    if (courseDoc.exists()) {
      const newCourseDocuments = courseDoc
        .data()
        ?.courseDocuments?.filter((it: DocumentData) => it.id !== documentId);
  
      await updateDoc(courseRef, {
        courseDocuments: newCourseDocuments,
      });
    }
  };
  
  export const updateDocument = async (
    courseCode: string,
    newDocument: DocumentData
  ) => {
    const courseRef = doc(db, "courses", courseCode);
    const courseDoc = await getDoc(courseRef);
  
    if (courseDoc.exists()) {
      const newCourseDocuments = courseDoc
        .data()
        ?.courseDocuments?.map((it: DocumentData) =>
          it.id === newDocument.id ? newDocument : it
        );
  
      await updateDoc(courseRef, {
        courseDocuments: newCourseDocuments,
      });
    }
  };
  