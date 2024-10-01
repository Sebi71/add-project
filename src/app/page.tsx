"use client";

import useAuth from "@/hooks/useAuth";

import FormLogin from "@/components/FormLogin";
import Loader from "@/components/loader/Loader";

export default function Home() {
  const {isFetch} = useAuth();

  if (isFetch) {
    <Loader />
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-slate-700 text-3xl mb-2">Connexion :</h1>
      <FormLogin />
    </div>
  );
}
