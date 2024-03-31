import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
export const loadCourse = async () => {
  const store: DocumentData[] = [];
  const querySnapshot = await getDocs(collection(db, "courses"));
  querySnapshot.forEach((doc) => {
    store.push(doc.data());
  });
  return store;
};
