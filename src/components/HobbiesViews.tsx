import { useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useFirebaseHobbie } from "@/context/hobbieContext";
import Filter from "./Filter";

export default function HobbiesViews() {
  const { hobbies } = useFirebaseHobbie();
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = [
    ...hobbies
      .map((hobbie) => hobbie.category)
      .filter((category, index, self) => self.indexOf(category) === index),
  ];

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredHobbies =
    selectedCategory === "Tous"
      ? hobbies
      : hobbies.filter((hobbie) => hobbie.category === selectedCategory);

  return (
    <>
      <h1 className="text-2xl font-black text-center pt-4 mb-10">
        Mes réalisations:
      </h1>
      <Filter categories={categories} handleFilter={handleFilter} />
      <div className="max-w-[1200px] mt-10 pb-10 pl-4 pr-4 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-b-2">
        {filteredHobbies.map((hobbie) => (
          <Link href={`/hobbies/${hobbie.id}`} key={hobbie.id}>
            <Card className="h-full p-3 hover:translate-y-[-10px] transition-all">
              <div className="w-full relative">
                <Image
                  src={hobbie.pictures[hobbie.pictures.length - 1]}
                  alt={`photo de couverture du projet ${hobbie.title}`}
                  width={1024}
                  height={460}
                  className="h-[200px] w-auto object-cover m-auto"
                  priority
                />
              </div>
              <h2 className="font-black uppercase mt-4">{hobbie.title}</h2>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
