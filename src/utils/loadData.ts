import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Dispatch } from "react";
import { db } from "../firebase";
import { TPerson } from "../pages/Profile";

export const loadData = async (
  currentUser: User,
  setState: Dispatch<TPerson>
) => {
  const docRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);
  console.log("Data: ", docSnap.data());
  console.log("Id: ", docSnap.data()?.uid);
  setState({
    name: docSnap.data()?.name,
    image: docSnap.data()?.image,
    email: docSnap.data()?.email,
    password: docSnap.data()?.password,
    role: docSnap.data()?.role,
  });
  return docSnap.data();
};
