"use client";

import ProtectedRoute from "../../../../componenents/protectedRoute";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/db/configFirebase";
import { HobbieFormData, HobbiePageProps } from "@/types/types";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import NavHobbie from "@/components/NavHobbie";

export default function HobbieIdPage({ params }: HobbiePageProps) {
  const [loading, setLoading] = useState(true);
  const [hobbie, setHobbie] = useState<HobbieFormData | null>(null);

  useEffect(() => {
    const hobbieId = params.id as string;

    const unsubscribe = onSnapshot(collection(db, "hobbies"), (snapshot) => {
      const foundHobbie = snapshot.docs.find((doc) => doc.id === hobbieId);

      if (foundHobbie) {
        setHobbie({
          id: foundHobbie.id,
          ...foundHobbie.data(),
        } as HobbieFormData);
      } else {
        setHobbie(null);
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

  if (!hobbie) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center gap-10">
        <p className="uppercase text-3xl font-black">Ce projet n'existe pas</p>
        <Link href={"/hobbies"} className="text-xl hover:font-black">
          Cliquez ici pour retourner au tableau de bord
        </Link>
      </section>
    );
  }

  return (
    <ProtectedRoute>
      <NavHobbie />
      <div className="ml-5 mr-5">
        <Link href={`/hobbies/updatehobbie/${hobbie.id}`}>
          <button className="bg-slate-400 hover:bg-blue-500 rounded-md p-3 flex items-center mt-6">
            Modifier le projet
          </button>
        </Link>
        <h1 className="text-3xl font-black text-center pt-4 mb-10">
          {hobbie?.title}
        </h1>

        <div className="border-2 rounded-md mb-10 p-2">
          <p>{hobbie?.resum} :</p>
        </div>

        <div className="max-w-[1200px] mb-16 pb-4 pl-4 pr-4 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2">
          {hobbie?.pictures.map((picture, index) => (
            <Card key={index}>
              <Image
                src={picture}
                alt={`Photo du projet ${hobbie?.title} ${index + 1}`}
                width={1024}
                height={460}
                className="rounded-xl h-[375px] object-cover"
              />
            </Card>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
