//npm i zod react-hook-form @hookform/resolvers react-toastify
//npm install next-auth

import { FormData } from "@/types/types";
import { loginSchema } from "@/schemas/loginSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormLogin() {
  const router = useRouter();

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

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (response && !response.error) {
        toast.success("Connexion réussie");
        router.push("/dashboard");
      } else {
        toast.error(response?.error || "Erreur lors de la connexion");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[800px] flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md"
    >
      <label className="text-slate-900">Nom d'utilisateur (email) : </label>
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
      <button
        type="submit"
        className="mt-4 h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Se connecter
      </button>
    </form>
  );
}
