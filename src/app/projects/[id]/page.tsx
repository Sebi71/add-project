"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/db/configFirebase";
import { ProjectFormData, UpdatePageProps } from "@/types/types";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import NavBar from "@/components/NavBar";

export default function ProjectPage({ params }: UpdatePageProps) {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectFormData | null>(null);

  useEffect(() => {
    const projectId = params.id as string;

    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const foundProject = snapshot.docs.find((doc) => doc.id === projectId);

      if (foundProject) {
        setProject({
          id: foundProject.id,
          ...foundProject.data(),
        } as ProjectFormData);
      } else {
        setProject(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  if (loading) {
    return (
      //ajout loader
      <section className="w-full h-screen flex items-center">
        Chargement en cours...
      </section>
    );
  }

  if (!project) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center gap-10">
        <p className="uppercase text-3xl font-black">Ce projet n'existe pas</p>
        <Link href={"/dashboard"} className="text-xl hover:font-black">
          Cliquez ici pour retourner au tableau de bord
        </Link>
      </section>
    );
  }

  return (
    <>
      <NavBar />
      <div className="ml-5 mr-5">
        <h1 className="text-3xl font-black text-center pt-4 mb-10">
          {project?.title}
        </h1>

        <div className="border-2 rounded-md mb-10 p-2">
          <span >{project?.resum} :</span>
          <p className="mt-4">{project?.description}</p>
        </div>
        <div>
          <h2 className="text-xl underline">Liens :</h2>
          <div className="flex flex-col gap-2 mb-10">
            <Link href={project?.githubLink} target="_blank">
              {project?.githubLink}
            </Link>
            {project?.liveLink && (
              <Link href={project?.liveLink} target="_blank">
                {project?.liveLink}
              </Link>
            )}
          </div>
        </div>
        <h2 className="text-xl underline">Compétences :</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-10 border-b-2 pb-5">
          {project?.skills.map((skill) => (
            <div key={skill.id} className="flex flex-col items-center justify-center border-slate-500 border-solid border-2 p-2 rounded-lg w-[105px] h-[120px]">
              <img
                src={skill.logo}
                alt={`compétence ${skill.name}`}
                width={50}
                height={50}
              />
              <p>{skill.name}</p>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mb-16 pb-4 pl-4 pr-4 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2">
          {project?.pictures.map((picture, index) => (
            <Card key={index}>
              <Image
                src={picture}
                alt={`Photo du projet ${project?.title} ${index + 1}`}
                width={1024}
                height={460}
              />
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
