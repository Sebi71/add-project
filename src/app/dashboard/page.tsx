"use client";

import { useState } from "react";
import ProtectedRoute from "../../../componenents/protectedRoute";
import SkillsView from "@/components/SkillsView";
import ProjectsView from "@/components/ProjectsView";
import { useFirebaseProjects } from "@/context/projectContext";
import Filter from "@/components/Filter";
import NavDashboard from "@/components/NavDashboard";



export default function Dashboardpage() {
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


  return (
    <ProtectedRoute>
        <>
          <NavDashboard dashboard={true}/>
          <div className="border-b-2 pb-5">
            <SkillsView />
          </div>
          <div className="w-full h-full mx-auto">
            <h1 className="text-xl font-black text-center pt-4 mb-4">Liste des projets :</h1>
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

