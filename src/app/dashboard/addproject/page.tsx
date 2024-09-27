"use client"

import ProtectedRoute from "../../../../componenents/protectedRoute"
import AddProject from "@/components/AddProject"
import NavBar from "@/components/NavBar";

export default function AddProjectPage() {

  return (
    <ProtectedRoute>
      <NavBar />
      <h1 className="text-4xl text-center mt-4">Ajouter un nouveau projet</h1>
      <AddProject />
    </ProtectedRoute>
  )
}