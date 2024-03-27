import { User, createUserWithEmailAndPassword } from "firebase/auth";
import React, { FormEvent, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Person } from "../Profile/Person/Person";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const createUser = async (e: FormEvent, currentUser: User) => {
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
  const CreateAccount = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(role);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        createUser(e, userCredential.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="sign-in-container">
      <form onSubmit={CreateAccount}>
        <h1>Create new account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <select name="role" id="" onChange={(e) => setRole(e.target.value)}>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateAccount;
