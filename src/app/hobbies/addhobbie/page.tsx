"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/app/db/configFirebase";
import { useRouter } from "next/navigation";
import { GiReturnArrow } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";
import ProtectedRoute from "../../../../componenents/protectedRoute";
import AddHobbie from "@/components/AddHobbie"


export default function AddHobbiePage() {
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth);
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <>
        <nav className="flex items-center justify-between border-b-2 pr-10">
          <Link
            className="bg-grey-300 hover:bg-grey-500 rounded-md p-3 flex items-center m-6"
            href={"/hobbies"}
            aria-label="Retour au tableau de bord"
          >
            <GiReturnArrow size={24} />
          </Link>
          <h1 className="text-2xl uppercase font-semibold">Ajout d'un projet passion</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-300 hover:bg-red-500 rounded-md p-3 flex items-center"
            aria-label="Se deconnecter"
          >
            <CiLogout />
          </button>
        </nav>
        <AddHobbie />
      </>
    </ProtectedRoute>
  );
}
