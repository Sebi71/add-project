"use client"
import { getAuth } from "firebase/auth";
import ProtectedRoute from "../../../../componenents/protectedRoute"
import AddProject from "@/components/AddProject"
import NavBar from "@/components/NavBar";

export default function AddProjectPage() {
  const auth = getAuth();
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Utilisateur connecté :", user);
  } else {
    console.log("Aucun utilisateur connecté pour addproject");
  }
});

  return (
    <ProtectedRoute>
      <NavBar />
      <h1 className="text-4xl text-center mt-4">Ajouter un nouveau projet</h1>
      <AddProject />
    </ProtectedRoute>
  )
}