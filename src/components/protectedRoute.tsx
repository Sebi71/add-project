"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/loader/Loader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isFetch } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isFetch) {
      router.push("/");
    }
  }, [user, isFetch, router]);

  if (isFetch)
    return (
      <section className="h-screen w-full flex items-center justify-center">
        <Loader />
      </section>
    );

  return children;
};

export default ProtectedRoute;

