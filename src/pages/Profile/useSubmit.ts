import { FormEvent } from "react";
import { db, storage } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { User } from "firebase/auth";

export const submitProfile = async (e: FormEvent, currentUser: User) => {
  const target = e.target as typeof e.target & {
    name: { value: string };
    email: { value: string };
    password: { value: string };
    file: { files: FileList };
  };
  const name = target.name.value;
  const email = target.email.value;
  const date = new Date().getTime();
  const file = target.file.files[0];
  console.log(file);
  const storageRef = ref(storage, `${name + date}`);

  try {
    await uploadBytesResumable(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        name,
        email,
        role: "",
        image: downloadURL,
      });
      console.log("Profile updated successfully");
      return "/"; // Assuming "/" is the success route
    }
  } catch (error) {
    console.error("Error submitting profile:", error);
    throw error; // Rethrow the error to be caught by the calling code
  }
};
