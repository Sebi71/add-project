"use client"

import ProtectedRoute from "../../../../componenents/protectedRoute";
import NavBar from "@/components/NavBar";
import AddSkill from "@/components/AddSkill"

export default function AddSkillPage() {

  return (
    <ProtectedRoute>  
      <NavBar />
        <h1 className="text-4xl text-center mt-4">Ajouter une compétence</h1>
        <AddSkill />
    </ProtectedRoute>
  )
}