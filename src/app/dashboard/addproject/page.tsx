"use client"

import ProtectedRoute from "../../../../componenents/protectedRoute"
import { useRouter } from "next/navigation"
import { GiReturnArrow } from "react-icons/gi";
import AddProject from "@/components/AddProject"

export default function AddProjectPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <button
          className="bg-grey-300 hover:bg-grey-500 rounded-md p-3 flex items-center m-6"
          onClick={() => router.push("/dashboard")}
        >
          <GiReturnArrow size={24} />
        </button>
      <h1 className="text-4xl text-center mt-4">Ajouter un nouveau projet</h1>
      <AddProject />
    </ProtectedRoute>
  )
}