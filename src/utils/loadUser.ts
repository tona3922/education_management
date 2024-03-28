import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
export const loadUser = async (role: string) => {
  const q = query(collection(db, "users"), where("role", "==", role));
  const store: DocumentData[] = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    store.push(doc.data());
  });
  return store;
};
