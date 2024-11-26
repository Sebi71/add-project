import useAuth from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/app/db/configFirebase";
import { useRouter } from "next/navigation";

interface ChoicePage {
  dashboard: boolean;
}

const NavDashboard: React.FC<ChoicePage> = ({ dashboard }) => {
  // export default function NavDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = () => {
    signOut(auth);
    router.push("/");
  };

  return (
    <>
      <nav className="flex items-center justify-center flex-col gap-5 mt-10 ml-5 mr-5 border-b-2 pb-5">
        <span className="text-4xl text-gray-700 uppercase font-black">
          Bienvenue
        </span>
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

          {dashboard ? (
            <>
              <button
                onClick={() => router.push("/dashboard/addproject")}
                className="bg-green-400 hover:bg-green-500 rounded-md p-3 flex items-center"
              >
                Ajouter un projet
              </button>
              <button
                onClick={() => router.push("/dashboard/addskill")}
                className="bg-blue-400 hover:bg-blue-500 rounded-md p-3 flex items-center"
              >
                Ajouter une compétence
              </button>
            </>
          ) : (
            <button
            onClick={() => router.push("/hobbies/addhobbie")}
            className="bg-blue-400 hover:bg-blue-500 rounded-md p-3 flex items-center"
          >
            Ajouter un projet
          </button>
          )}

          <button
            onClick={() => router.push("/home")}
            className="bg-yellow-400 hover:bg-yellow-500 rounded-md p-3 flex items-center"
          >
            Page d'accueil
          </button>
        </div>
      </nav>
    </>
  );
};

export default NavDashboard;
