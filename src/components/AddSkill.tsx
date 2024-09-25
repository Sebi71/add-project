import { useRouter } from "next/navigation";
import { useFirebaseSkills } from "@/context/skillContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/db/configFirebase";
import { useState } from "react";
import { SkillFormData } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { skillSchema } from "@/schemas/skillSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddSkill() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const { addSkill } = useFirebaseSkills();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category: "",
      name: "",
      logo: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(undefined);
    }
  };

  const onSubmit: SubmitHandler<SkillFormData> = async (data) => {
    try {
      let imageUrl = "";
      if (file) {
        const imageRef = ref(storage, `skillsLogos/${file.name}`);
        await uploadBytes(imageRef, file);
        console.log("Fichier téléversé avec succès :", file.name);
        imageUrl = await getDownloadURL(imageRef);
        console.log("URL du fichier :", imageUrl);
      }
      await addSkill({
        ...data,
        logo: imageUrl,
      });
      setImagePreview(undefined);
      toast.success("Compétence ajoutée avec succès");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[500px] m-auto mt-10 flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md"
    >
      <select id="category" {...register("category")} className="h-10 border border-slate-900 rounded-md">
        <option value="">Sélectionnez une catégorie</option>
        <option value="acquise">Acquise</option>
        <option value="à développer">A développer</option>
      </select>
      {errors.category && <p className="text-red-500">{errors.category.message}</p>}
      <label htmlFor="intitulé" className="text-slate-900">
        Intitulé :
      </label>
      <input
        type="text"
        className="h-10 border border-slate-900 p-4 rounded-md"
        id="intitulé"
        {...register("name")}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <label htmlFor="logo" className="text-slate-900 mt-10">
        Logo :
      </label>
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp image/jpg, */svg"
        onChange={handleChange}
        id="logo"
      />
      {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}

      {imagePreview && (
        <img
          className="max-w-[100px] h-auto flex"
          src={imagePreview}
          alt={imagePreview}
        />
      )}
      <button className="mt-4 h-10 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
        Envoyer à la BDD
      </button>
    </form>
  );
}
