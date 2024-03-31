import { User } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { FormEvent } from "react";
import { db } from "../../firebase";
import { Person } from "../Profile/Person/Person";

export const createUser = async (e: FormEvent, currentUser: User) => {
  console.log("gogo");
  const target = e.target as typeof e.target & {
    email: { value: string };
    password: { value: string };
    role: { value: string };
  };
  const email = target.email.value;
  const password = target.password.value;
  const role = target.role.value;
  const user = new Person("", email, password, role);
  // console.log(email);
  // console.log(password);
  // console.log(role);
  if (currentUser) {
    await setDoc(doc(db, "users", currentUser.uid), {
      uid: currentUser.uid,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    console.log("Create user successfully");
  }
};
