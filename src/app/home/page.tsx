"use client";

import useAuth from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/app/db/configFirebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import projectImage from "@/public/images/pexels-luis-gomes-166706-546819.webp";
import hobbiesImage from "@/public/images/pexels-pixabay-301703.webp";
import ProtectedRoute from "../../../componenents/protectedRoute";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = () => {
    signOut(auth);
    router.push("/");
  };
  return (
    <ProtectedRoute>
      <>
        <nav className="flex items-center justify-center flex-col gap-5 mt-10 ml-5 mr-5 mb-20">
          <h1 className="text-4xl text-gray-700 uppercase font-black">
            Bienvenue
          </h1>
          <p>
            <b>Email: </b>
            {user?.email}
          </p>
          <div className="flex gap-8">
            <button
              onClick={handleSignOut}
              className="bg-red-300 hover:bg-red-500 rounded-md p-3 flex items-center"
            >
              Se déconnecter
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-green-400 hover:bg-green-500 rounded-md p-3 flex items-center"
            >
              Page projet
            </button>
            <button
              onClick={() => router.push("/hobbies")}
              className="bg-blue-400 hover:bg-blue-500 rounded-md p-3 flex items-center"
            >
              Page passion
            </button>
          </div>
        </nav>
        <div className="flex items-center justify-center gap-10">
          <div
            onClick={() => router.push("/dashboard")}
            className="hover:scale-105 transition-all cursor-pointer"
          >
            <Image
              src={projectImage}
              alt={`photo projet pour aller à la page`}
              width={500}
              height={332}
              className="h-[200px] w-auto object-cover rounded-xl"
              priority
            />
            <h2 className="text-center text-xl uppercase mt-5">Mes projets</h2>
          </div>
          <div
            onClick={() => router.push("/hobbies")}
            className="hover:scale-105 transition-all cursor-pointer"
          >
            <Image
              src={hobbiesImage}
              alt={`photo hobbies pour aller à la page`}
              width={500}
              height={333}
              className="h-[200px] w-auto object-cover rounded-xl"
              priority
            />
            <h2 className="text-center text-xl uppercase mt-5">Mes hobbies</h2>
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
