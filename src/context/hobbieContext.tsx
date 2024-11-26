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
import { HobbieFormData, HobbieDbContextType } from "@/types/types";

const HobbieContext = createContext<HobbieDbContextType | null>(null);

export const useFirebaseHobbie = () => {
  const context = useContext(HobbieContext);
  if (!context) {
    throw new Error("Une erreur a eu lieu dans le context");
  }
  return context;
};

export const HobbieProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hobbies, setHobbies] = useState<HobbieFormData[]>([]);

  useEffect(() => {
    const q = query(collection(db, "hobbies"));
    const unsuscribe = onSnapshot(q, (snapshot) => {
      const data: HobbieFormData[] = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        } as HobbieFormData);
      });
      setHobbies(data);
    });

    return () => unsuscribe();
  }, []);

  const addHobbie = async (
    data: Omit<HobbieFormData, "id">
  ) => {
    try {
        const docRef = await addDoc(collection(db, "hobbies"), {
            ...data,
        });
        const newHobbie: HobbieFormData = {id: docRef.id, ...data};
        setHobbies((prevHobbies) => {
            const isDuplicate = prevHobbies.some(hobbie => hobbie.title === newHobbie.title);
            if (!isDuplicate) {
                return [...prevHobbies, newHobbie];
            }
            return prevHobbies;
        })
    } catch (error) {
        console.error(
            "Une erreur est survenue lors de l'ajout de l'article",
            error
        );
        throw new Error("Erreur dans l'ajout de l'article");
    }
  }

  const updateHobbie = async (hobbie: HobbieFormData) => {
    try {
      const hobbieRef = doc(db, "hobbies", hobbie.id);
      const {id, ...dataToUpdate} = hobbie;
      await updateDoc(hobbieRef, dataToUpdate);
      setHobbies((prevHobbies) =>
        prevHobbies.map((a) => (a.id === hobbie.id ? { ...a, ...dataToUpdate } : a))
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
    hobbies,
    addHobbie,
    updateHobbie,
  };

  return <HobbieContext.Provider value={value}>{children}</HobbieContext.Provider>;
};
