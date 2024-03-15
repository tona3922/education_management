// import { FormEvent } from "react";
// import { db, storage } from "../../firebase";
// import { setDoc, doc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { User } from "firebase/auth";

// export const handleSubmit = async (e: FormEvent,currentUser: User) => {
//     setLoading(true);
//     e.preventDefault();
//     const target = e.target as typeof e.target & {
//       name: { value: string };
//       email: { value: string };
//       password: { value: string };
//       file: { files: FileList };
//     };
//     const name = target.name.value;
//     const email = target.email.value;
//     const date = new Date().getTime();
//     const file = target.file.files[0];
//     console.log(file);
//     const storageRef = ref(storage, `${name + date}`);
//     await uploadBytesResumable(storageRef, file)
//       .then(() => {
//         getDownloadURL(storageRef)
//           .then(async (downloadURL) => {
//             if (currentUser) {
//               await setDoc(doc(db, "users", currentUser.uid), {
//                 uid: currentUser.uid,
//                 name,
//                 email,
//                 role: "",
//                 image: downloadURL,
//               })
//                 .then(() => {
//                   navigate("/home");
//                 })
//                 .catch((err) => {
//                   console.log("1st: ", err);
//                   setErr(true);
//                 });
//             }
//           })
//           .catch((err) => {
//             console.log("2nd: ", err);
//           });
//       })
//       .catch((err) => {
//         console.log("3rd: ", err);
//       });
//   };
