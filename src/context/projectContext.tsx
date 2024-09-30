"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "@/app/db/configFirebase";
import { ProjectFormData, ProjectsDbContextType } from "@/types/types";

const ProjectContext = createContext<ProjectsDbContextType | null>(null);

export const useFirebaseProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("Une erreur a eu lieu dans le context");
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<ProjectFormData[]>([]);

  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsuscribe = onSnapshot(q, (snapshot) => {
      const data: ProjectFormData[] = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        } as ProjectFormData);
      });
      setProjects(data);
    });

    return () => unsuscribe();
  }, []);

  const addProject = async (
    data: Omit<ProjectFormData, "id">
  ) => {
    try {
        const docRef = await addDoc(collection(db, "projects"), {
            ...data,
        });
        const newProject: ProjectFormData = {id: docRef.id, ...data};
        setProjects((prevProjects) => {
            const isDuplicate = prevProjects.some(project => project.title === newProject.title);
            if (!isDuplicate) {
                return [...prevProjects, newProject];
            }
            return prevProjects;
        })
    } catch (error) {
        console.error(
            "Une erreur est survenue lors de l'ajout de l'article",
            error
        );
        throw new Error("Erreur dans l'ajout de l'article");
    }
  }

  const updateProject = async (project: ProjectFormData) => {
    try {
      const projectRef = doc(db, "projects", project.id);
      const {id, ...dataToUpdate} = project;
      await updateDoc(projectRef, dataToUpdate);
      setProjects(
        projects.map((a) => (a.id === project.id ? { ...a, ...dataToUpdate } : a))
      );
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la modification de l'article",
        error
      );
      throw new Error("Erreur dans la modification de l'article");
    }
  }


  const value = {
    projects,
    addProject,
    updateProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
