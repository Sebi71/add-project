"use client";

import NavDashboard from "@/components/NavDashboard";
import ProtectedRoute from "../../../componenents/protectedRoute";
import HobbiesViews from "@/components/HobbiesViews";

export default function Hobbies() {
  return (
    <ProtectedRoute>
      <>
        <NavDashboard dashboard={false} />
        <HobbiesViews />
      </>
    </ProtectedRoute>
  );
}
