"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../componenents/protectedRoute";

export default function Dashboardpage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <ProtectedRoute>
      {session ? (
        <div>
          <div className="w-full flex items-center justify-center flex-col gap-5 mt-10">
            <h1 className="text-4xl text-gray-700 uppercase font-black">
              Bienvenue <b>{session.user?.name}</b>
            </h1>
            <p>
              <b>Email: </b>
              {session.user?.email}
            </p>
            <div className="flex gap-8">
              <button
                onClick={() => signOut()}
                className="bg-red-300 hover:bg-red-500 rounded-md p-3 flex items-center"
              >
                Se déconnecter
              </button>
              <button
              onClick={()=> router.push("/dashboard/addproject")}
                className="bg-green-400 hover:bg-green-500 rounded-md p-3 flex items-center"
              >
                Ajouter un projet
              </button>
              <button
              onClick={()=> router.push("/dashboard/addskill")}
                className="bg-blue-400 hover:bg-blue-500 rounded-md p-3 flex items-center"
              >
                Ajouter une compétence
              </button>
            </div>
          </div>
          {/* gallerie de projet */}
        </div>
      ) : null}
    </ProtectedRoute>
  );
}
