"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return null; // Ou un loader si vous le souhaitez
  }

  return <>{children}</>;
};

export default ProtectedRoute;