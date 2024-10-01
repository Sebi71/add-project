import { signOut } from "firebase/auth"
import {auth} from "@/app/db/configFirebase"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GiReturnArrow } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";

export default function NavBar() {
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth)
    router.push("/")
    }

  return (
    <nav className="flex items-center justify-between border-b-2 pr-10">
      <Link
        className="bg-grey-300 hover:bg-grey-500 rounded-md p-3 flex items-center m-6"
        href={"/dashboard"}
        aria-label="Retour au tableau de bord"
      >
        <GiReturnArrow size={24} />
      </Link>
      <div className="flex gap-8">
        <Link
          href={"/dashboard/addproject"}
          className="bg-green-400 hover:bg-green-500 rounded-md p-3 flex items-center"
        >
          Projet +
        </Link>
        <Link
          href={"/dashboard/addskill"}
          className="bg-blue-400 hover:bg-blue-500 rounded-md p-3 flex items-center"
        >
          Compétence +
        </Link>
        <button
          onClick={handleSignOut}
          className="bg-red-300 hover:bg-red-500 rounded-md p-3 flex items-center"
          aria-label="Se deconnecter"
        >
          <CiLogout />
        </button>
      </div>
    </nav>
  );
}
