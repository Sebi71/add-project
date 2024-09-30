"use client"

import { ProjectFormData, SkillFormData, UpdatePageProps } from "@/types/types";
import ProtectedRoute from "@/../../componenents/protectedRoute"
import UpdateProject from "@/components/UpdateProject";
import NavBar from "@/components/NavBar";

export default function AddProjectPage({params}: UpdatePageProps) {

  return (
    <ProtectedRoute>
      <NavBar />
      <h1 className="text-4xl text-center mt-4">Modifier ce projet :</h1>
      <UpdateProject params={params} />
    </ProtectedRoute>
  )
}