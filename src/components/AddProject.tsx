import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFirebaseSkills } from "@/context/skillContext";
import { useFirebaseProjects } from "@/context/projectContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/db/configFirebase";
import { useState, useRef } from "react";
import { ProjectFormData, SkillFormData } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { projectSchema } from "@/schemas/projectSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProject(data: ProjectFormData) {
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | undefined>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { skills } = useFirebaseSkills();
  const { addProject } = useFirebaseProjects();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
        type: "",
        category: "",
        title: "",
        resum: "",
        cover: "",
        pictures: [],
        description: "",
        skills: [],
        githubLink: "",
        liveLink: "",
    },
});
console.log("Form errors:", errors);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setCoverFile(selectedFile);

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setCoverPreview(imageUrl);
    } else {
      setCoverPreview(undefined);
    }
  };

  const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const newFiles = Array.from(files);
      const updatedFiles = [...imageFiles, ...newFiles];
      setImageFiles(updatedFiles);
      const previews = updatedFiles.map((file) => URL.createObjectURL(file));
      setImagePreview(previews);
    } else {
      setImagePreview([]);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreview.filter((_, i) => i !== index);

    if (updatedFiles.length === 0) {
      setImageFiles([]);
      setImagePreview([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setImageFiles(updatedFiles);
      setImagePreview(updatedPreviews);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    console.log("Form submitted with data:", data);
    const selectedSkills: SkillFormData[] = skills.filter(skill =>
        data.skills.includes(skill.name) 
      );

    try {
      let imageUrl = "";
      let previews: string[] = [];

      if (coverFile) {
        const coverRef = ref(storage, `projects/${coverFile.name}`);
        await uploadBytes(coverRef, coverFile);
        console.log("Fichier déplacé avec succès :", coverFile.name);
        imageUrl = await getDownloadURL(coverRef);
        console.log("URL du fichier :", imageUrl);
      }

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const imageRef = ref(storage, `projects/${file.name}`);
          await uploadBytes(imageRef, file);
          console.log("Fichier téléversé avec succès :", file.name);
          const url = await getDownloadURL(imageRef);
          console.log("URL du fichier :", url);
          return url;
        });

        previews = await Promise.all(uploadPromises);
      }

      console.log("Adding project with data:", {
        ...data,
        cover: imageUrl,
        pictures: previews,
      });

      await addProject({
        ...data,
        cover: imageUrl,
        pictures: previews,
        skills: selectedSkills,
      });

      setCoverPreview(undefined);
      setImagePreview([]);
      setImageFiles([]);
      toast.success("Projet ajouté avec succès");
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
      className="max-w-[700px] m-auto mt-10 mb-10 flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md"
    >
      <label htmlFor="type" className="text-slate-900 mt-2">
        Type de projet :
      </label>
      <select
        id="type"
        {...register("type")}
        className="h-10 border border-slate-900 rounded-md"
      >
        <option value="">Sélectionnez un type de projet :</option>
        <option value="cours">Cours</option>
        <option value="personnel">Personnel</option>
      </select>
      {errors.type && <p className="text-red-500">{errors.type.message}</p>}

      <label htmlFor="category" className="text-slate-900 mt-10">
        Catégorie de projet :
      </label>
      <select
        id="category"
        {...register("category")}
        className="h-10 border border-slate-900 rounded-md"
      >
        <option value="">Sélectionnez une catégorie</option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.name}>
            {skill.name}
          </option>
        ))}
      </select>
      {errors.category && (
        <p className="text-red-500">{errors.category.message}</p>
      )}

      <label htmlFor="title" className="text-slate-900 mt-10">
        Titre du projet :
      </label>
      <input
        type="text"
        id="title"
        {...register("title")}
        className="h-10 border border-slate-900 rounded-md pl-2"
      />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <label htmlFor="resum" className="text-slate-900 mt-10">
        Résumé du projet :
      </label>
      <textarea
        id="resum"
        {...register("resum")}
        className="h-[70px] border border-slate-900 rounded-md pl-2"
      />
      {errors.resum && <p className="text-red-500">{errors.resum.message}</p>}

      <label htmlFor="cover" className="text-slate-900 mt-10">
        Image de couverture :
      </label>
      <input
        type="file"
        id="cover"
        accept="image/jpeg, image/png, image/webp, image/jpg, image/svg+xml"
        onChange={handleCoverChange}
      />
      {errors.cover && <p className="text-red-500">{errors.cover.message}</p>}

      {coverPreview && (
        <Image
          src={coverPreview}
          alt="image de couverture"
          width={1024}
          height={200}
        />
      )}

      <label htmlFor="pictures" className="text-slate-900 mt-10">
        Images :
      </label>
      <input
        type="file"
        id="pictures"
        accept="image/jpeg, image/png, image/webp, image/jpg, image/svg+xml"
        onChange={handlePicturesChange}
        multiple
        ref={fileInputRef}
      />
      {errors.pictures && (
        <p className="text-red-500">{errors.pictures.message}</p>
      )}

      <div className="grid grid-cols-3 gap-4 mt-2">
        {imagePreview.map((preview, index) => (
          <Image
            key={index}
            src={preview}
            alt="image de couverture"
            width={1024}
            height={200}
            onClick={() => removeImage(index)}
          />
        ))}
      </div>

      <label htmlFor="description" className="text-slate-900 mt-10">
        Description du projet :
      </label>
      <textarea
        id="description"
        {...register("description")}
        className="h-[150px] border border-slate-900 rounded-md pl-2"
      />
      {errors.description && (
        <p className="text-red-500">{errors.description.message}</p>
      )}

      <legend className="text-slate-900 mt-10">Compétences :</legend>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={skill.name}
              value={skill.name}
              {...register("skills")}
            />
            <label htmlFor={skill.name}>{skill.name}</label>
          </div>
        ))}
      </div>
      {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}

      <label htmlFor="githubLink" className="text-slate-900 mt-10">
        Lien Github :
      </label>
      <input
        type="text"
        id="githubLink"
        {...register("githubLink")}
        className="h-10 border border-slate-900 rounded-md pl-2"
      />
      {errors.githubLink && (
        <p className="text-red-500">{errors.githubLink.message}</p>
      )}

      <label htmlFor="liveLink" className="text-slate-900 mt-10">
        Lien Live :
      </label>
      <input
        type="text"
        id="liveLink"
        {...register("liveLink")}
        className="h-10 border border-slate-900 rounded-md pl-2"
      />
      <button className="mt-4 h-10 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
        Envoyer à la BDD
      </button>
    </form>
  );
}
