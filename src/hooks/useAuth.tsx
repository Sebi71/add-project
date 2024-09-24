// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth } from "@/app/db/configFirebase";
// import {
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   User,
// } from "firebase/auth";

// const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isFetch, setIsFetch] = useState(true);
//   const router = useRouter();

//   const signIn = async (email: string, password: string) => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       setUser(userCredential.user);
//       router.push("/dashboard");
//     } catch (error) {
//       // console.error(error, "erreur signIn");
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
//       if (user) {
//         setUser(user);
//         setIsFetch(false);
//       } else {
//         setUser(null);
//         setIsFetch(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const redirectIfAuthenticated = () => {
//     if (user) {
//       router.push("/dashboard");
//     }
//   };

//   return {
//     user,
//     isFetch,
//     redirectIfAuthenticated,
//     signIn,
//   };
// };

// export default useAuth;
