"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "@/app/db/configFirebase";
import { SkillFormData, DbContextType } from "@/types/types";

const SkillContext = createContext<DbContextType | null>(null);

export const useFirebaseSkills = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("Une erreur a eu lieu dans le context");
  }
  return context;
};

export const SkillProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
    const [skills, setSkills] = useState<SkillFormData[]>([]);

    useEffect(() => {
        const q = query(collection(db, "skills"));
        const unsuscribe = onSnapshot(q, (snapshot) => {
            const data: SkillFormData[] = [];
            snapshot.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...doc.data(),
                } as SkillFormData);
            });
            setSkills(data);
        });

        return () => unsuscribe();
    }, []);

    const addSkill = async (
        data: Omit<SkillFormData, "id">
    ) => {
        try {
            const docRef = await addDoc(collection(db, "skills"), {
                ...data,
            });
            const newSkill: SkillFormData = { id: docRef.id, ...data };
            setSkills((prevSkills) => [...prevSkills, newSkill]);
        } catch (error) {
            console.error(
                "Une erreur est survenue lors de l'ajout de l'article",
                error
            );
            throw new Error("Erreur dans l'ajout de l'article");
        }
    };

    const value = {
        skills,
        addSkill,
    };

    return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};

