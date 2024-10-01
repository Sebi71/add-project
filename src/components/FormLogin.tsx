"use client";

import { useState, useEffect } from "react";
import { FormData } from "@/types/types";
import { loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useAuth from "@/hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormLogin() {
  const { signIn, redirectIfAuthenticated } = useAuth();
  
  const [errorsAuth, setErrorsAuth] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  const onSubmit = async (data: FormData) => {
    try {
      await signIn(data.email, data.password);
      toast.success("Connexion réussie !");
    } catch (error: any) {
      setErrorsAuth(error.message);
      toast.error("Erreur de connexion. Vérifiez vos informations.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[800px] flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md"
    >
      <label className="text-slate-900">Nom d'utilisateur (email) :</label>
      <input
        {...register("email")}
        type="email"
        className="h-10 border border-slate-900 p-4 rounded-md"
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      
      <label className="text-slate-900">Mot de passe :</label>
      <input
        {...register("password")}
        type="password"
        className="h-10 border border-slate-900 p-4 rounded-md"
      />
      {errors.password && (
        <p className="text-red-500">{errors.password.message}</p>
      )}
      
      {errorsAuth && <p className="text-red-500">{errorsAuth}</p>}
      
      <button
        type="submit"
        className="mt-4 h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Se connecter
      </button>
    </form>
  );
}
