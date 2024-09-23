"use client";

import FormLogin from "@/components/FormLogin";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-slate-700 text-3xl mb-2">Connexion :</h1>
      <FormLogin />
    </div>
  );
}
