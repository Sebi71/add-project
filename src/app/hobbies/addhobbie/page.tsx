"use client";

import NavHobbie from "@/components/NavHobbie";
import ProtectedRoute from "../../../../componenents/protectedRoute";
import AddHobbie from "@/components/AddHobbie";

export default function AddHobbiePage() {
  return (
    <ProtectedRoute>
      <>
      <NavHobbie />
        <h1 className="text-center text-2xl mt-10 uppercase font-semibold">
          Ajout d'un projet passion
        </h1>
        <AddHobbie />
      </>
    </ProtectedRoute>
  );
}
