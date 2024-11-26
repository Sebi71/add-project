"use client";

import ProtectedRoute from "@/../../componenents/protectedRoute";
import NavHobbie from "@/components/NavHobbie";
import UpdateHobbie from "@/components/UpdateHobbie"
import { HobbiePageProps } from "@/types/types";

export default function UpdateProjectPage({params}: HobbiePageProps) {

    return (
        <ProtectedRoute>
            <NavHobbie />
            <h1 className="text-4xl text-center mt-4">Modifier ce projet :</h1>
            <UpdateHobbie params={params} />
        </ProtectedRoute>
    )
}
