import { FormEvent } from "react";
import { db, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";

export const submitProfile = async (e: FormEvent, currentUser: User) => {
  const target = e.target as typeof e.target & {
    name: { value: string };
    email: { value: string };
    password: { value: string };
  };
  const name = target.name.value;
  const email = target.email.value;
  const password = target.password.value;
  try {
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        name,
        email,
        password,
      });
      console.log("Profile updated successfully");
      return "/"; // Assuming "/" is the success route
    }
  } catch (error) {
    console.error("Error submitting profile:", error);
    throw error;
  }
};
export const submitImage = async (e: FormEvent, currentUser: User) => {
  const target = e.target as typeof e.target & {
    file: { files: FileList };
  };
  const date = new Date().getTime();
  const file = target.file.files[0];
  console.log(file);
  const storageRef = ref(storage, `avatar_${date}`);
  try {
    await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        image: downloadURL,
      });
      console.log("Avatar updated successfully");
      return "/"; // Assuming "/" is the success route
    }
  } catch (error) {
    console.error("Error submitting profile:", error);
    throw error; // Rethrow the error to be caught by the calling code
  }
};
