import { useFirebaseSkills } from "@/context/skillContext";
import { SkillFormData } from "@/types/types";
import { Checkbox } from "@nextui-org/checkbox";

export default function SkillsView() {
  const { skills, updateSkill } = useFirebaseSkills();

  const acquired = skills.filter((skill) => skill.category === "acquise");
  const learning = skills.filter((skill) => skill.category === "à développer");

  if (!Array.isArray(skills)) {
    return <p>Erreur: les compétences n'ont pas pu être chargées.</p>;
  }

  if (skills.length === 0) {
    return <p>Aucune compétence disponible.</p>;
  }

  const handleCheckboxChange = async (skillData: SkillFormData) => {
    const newCategory =
      skillData.category === "acquise" ? "à développer" : "acquise";
    try {
      const updatedSkill: SkillFormData = {
        id: skillData.id,
        category: newCategory,
        name: skillData.name,
        logo: skillData.logo,
      };
      await updateSkill(updatedSkill);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la compétence :", error);
    }
  };

  return (
    <>
      <h2 className="text-xl font-black text-center pt-4">Liste des compétences :</h2>
      <h3 className="text-xl mt-4 ml-4">Compétences acquises : </h3>
      <div className="flex justify-center flex-wrap gap-5 mt-5 mb-5">
        {acquired.map((skill) => (
          <div
            key={skill.name}
            className="flex flex-col justify-between items-center border-slate-500 border-solid border-2 p-2 rounded-lg w-[105px] h-[120px] relative"
            id={`label-${skill.name}`}
          >
            <Checkbox
              defaultSelected
              onChange={() => handleCheckboxChange(skill)}
              className="transform translate-x-full absolute"
              aria-label={`${skill.name} acquis`}
              aria-labelledby={`label-${skill.name}`}
            />
            <img src={skill.logo} alt={`compétence ${skill.name}`} width={50} height={50} />
            <p className="uppercase">{skill.name}</p>
          </div>
        ))}
      </div>
      <h3 className="text-xl mt-4 ml-4">Compétences à développer : </h3>
      <div className="flex justify-center flex-wrap gap-5 mt-10">
        {learning.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-col justify-between items-center border-slate-500 border-solid border-2 p-2 rounded-lg w-[105px] h-[120px] relative"
            id={`label-${skill.name}`}
          >
            <Checkbox
              onChange={() => handleCheckboxChange(skill)}
              className="transform translate-x-full absolute"
              aria-label={`${skill.name} à développer`}
              aria-labelledby={`label-${skill.name}`}
            />
            <img src={skill.logo} alt={`compétence ${skill.name}`} width={50} height={50} />
            <p className="uppercase">{skill.name}</p>
          </div>
        ))}
      </div>
    </>
  );
}
