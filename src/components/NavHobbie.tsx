import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/app/db/configFirebase";
import { useRouter } from "next/navigation";
import { GiReturnArrow } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";

export default function NavHobbie() {
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth);
    router.push("/");
  };
  return (
    <>
      <nav className="flex items-center justify-between border-b-2 pr-10">
        <Link
          className="bg-grey-300 hover:bg-grey-500 rounded-md p-3 flex items-center m-6"
          href={"/hobbies"}
          aria-label="Retour au tableau de bord"
        >
          <GiReturnArrow size={24} />
        </Link>

        <button
          onClick={handleSignOut}
          className="bg-red-300 hover:bg-red-500 rounded-md p-3 flex items-center"
          aria-label="Se deconnecter"
        >
          <CiLogout />
        </button>
      </nav>
    </>
  );
}
