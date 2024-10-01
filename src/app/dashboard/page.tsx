"use client";

import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../componenents/protectedRoute";
import SkillsView from "@/components/SkillsView";
import ProjectsView from "@/components/ProjectsView";
import { useFirebaseProjects } from "@/context/projectContext";
import Filter from "@/components/Filter";
import { signOut } from "firebase/auth"
import {auth} from "@/app/db/configFirebase"

export default function Dashboardpage() {
  const router = useRouter();
  const { user } = useAuth();
  const { projects } = useFirebaseProjects();

  const [selectCategory, setSelectCategory] = useState("Tous");
  const categories = projects
    .map((project) => project.category)
    .filter((category, index, self) => self.indexOf(category) === index);
  const handleFilter = (category: string) => {
    setSelectCategory(category);
  };

  const cours = projects.filter(
    (project) =>
      project.type === "cours" &&
      (selectCategory === "Tous" || project.category === selectCategory)
  );
  const personnel = projects.filter(
    (project) =>
      project.type === "personnel" &&
      (selectCategory === "Tous" || project.category === selectCategory)
  );

  const handleSignOut = () => {
    signOut(auth)
    router.push("/")
    }


  return (
    <ProtectedRoute>
        <>
          <nav className="flex items-center justify-center flex-col gap-5 mt-10 ml-5 mr-5 border-b-2 pb-5">
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
            </div>
          </nav>
          <div className="border-b-2 pb-5">
            <SkillsView />
          </div>
          <div>
            <h2 className="text-xl font-black text-center pt-4 mb-4">Liste des projets :</h2>
            <Filter categories={categories} handleFilter={handleFilter} />
            {personnel.length !== 0 && (
              <ProjectsView theme={"Projets personnels"} projects={personnel} />
            )}
            <ProjectsView theme={"Projets OpenClassrooms"} projects={cours} />
          </div>
        </>
    </ProtectedRoute>
  );
}
