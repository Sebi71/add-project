import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GiReturnArrow } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";

export default function NavBar() {
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between border-b-2 mr-10">
      <button
        className="bg-grey-300 hover:bg-grey-500 rounded-md p-3 flex items-center m-6"
        onClick={() => router.push("/dashboard")}
        aria-label="Retour au tableau de bord"
      >
        <GiReturnArrow onClick={() => router.push("/dashboard")} size={24} />
      </button>
      <div className="flex gap-8">
        <button
          onClick={() => router.push("/dashboard/addproject")}
          className="bg-green-400 hover:bg-green-500 rounded-md p-3 flex items-center"
        >
          Projet +
        </button>
        <button
          onClick={() => router.push("/dashboard/addskill")}
          className="bg-blue-400 hover:bg-blue-500 rounded-md p-3 flex items-center"
        >
          Compétence +
        </button>
        <button
          onClick={() => signOut()}
          className="bg-red-300 hover:bg-red-500 rounded-md p-3 flex items-center"
          aria-label="Se deconnecter"
        >
          <CiLogout />
        </button>
      </div>
    </nav>
  );
}
