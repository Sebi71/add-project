import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFirebaseSkills } from "@/context/skillContext";
import { useFirebaseProjects } from "@/context/projectContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/db/configFirebase";
import { useState, useRef, useEffect } from "react";
import { ProjectFormData, SkillFormData, UpdatePageProps } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { projectSchema } from "@/schemas/projectSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateProject({ params }: UpdatePageProps) {
  const router = useRouter();

  const { skills } = useFirebaseSkills();
  const { projects, updateProject } = useFirebaseProjects();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const projectId = params.id as string;

  const projectToUpdate = projects.find((project) => project.id === projectId);

  const skillsProject = projectToUpdate?.skills || [];
  const selectedSkills = skillsProject.map((skill) => skill.name);

  const formatDateForInput = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toISOString().split("T")[0]; 
  };
  const formattedDateForInput = formatDateForInput(projectToUpdate?.date);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [currentImageCover, setCurrentImageCover] = useState<
    string | undefined
  >(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [currentImageFiles, setCurrentImageFiles] = useState<string[]>([]);
  const [date, setDate] = useState(formattedDateForInput);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      ...projectToUpdate,
      date: projectToUpdate?.date,
    },
  });

  useEffect(() => {
    if (projectToUpdate) {
      setCurrentImageCover(projectToUpdate.cover);
      setCurrentImageFiles(projectToUpdate.pictures);
    }
  }, [projectToUpdate]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setCoverFile(selectedFile);

    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setCurrentImageCover(imageUrl);
    }
  };

  const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const newFiles = Array.from(files);
      const updatedFiles = [...imageFiles, ...newFiles];
      setImageFiles(updatedFiles);
      const previews = updatedFiles.map((file) => URL.createObjectURL(file));
      setCurrentImageFiles(previews);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = currentImageFiles.filter((_, i) => i !== index);

    setImageFiles(updatedFiles);
    setCurrentImageFiles(updatedPreviews);

    if (updatedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (formdata) => {
    const selectedSkills: SkillFormData[] = skills.filter((skill) =>
      // @ts-ignore
      formdata.skills.includes(skill.name)
    );

    const dateObject = new Date(date); 
    const timestamp = {
      seconds: Math.floor(dateObject.getTime() / 1000),
      nanoseconds: 0, 
    };

    try {
      let imageUrl = currentImageCover;
      let previews: string[] = [];

      const uploadImage = async (file: File) => {
        const uniqueFileName = `${uuidv4()}_${file.name.replace(/\s+/g, "_")}`;
        const imageRef = ref(storage, `projects/${uniqueFileName}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      };

      if (coverFile) {
        imageUrl = await uploadImage(coverFile);
      }

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(uploadImage);
        previews = await Promise.all(uploadPromises);
      } else {
        previews = currentImageFiles;
      }

      const updatedProject: ProjectFormData = {
        id: projectId,
        type: formdata.type,
        date: timestamp,
        category: formdata.category,
        title: formdata.title,
        resum: formdata.resum,
        cover: imageUrl as string,
        pictures: previews as string[],
        description: formdata.description,
        skills: selectedSkills,
        githubLink: formdata.githubLink,
        liveLink: formdata.liveLink,
      };
      updateProject(updatedProject);
      toast.success("Projet mis à jour avec succès");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du projet :", error);
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

      <label htmlFor="date" className="text-slate-900 mt-10">
        Date du projet :
      </label>
      <input
        type="date"
        id="date"
        value={date}
        {...register("date", { onChange: (e) => setDate(e.target.value) })} 
        className="h-10 border border-slate-900 rounded-md pl-2"
      />
      {errors.date && <p className="text-red-500">{errors.date.message}</p>}

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

      {currentImageCover && (
        <Image
          src={currentImageCover}
          alt={`photo de couverture du projet ${projectToUpdate?.title}`}
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
        {currentImageFiles.map((preview, index) => (
          <Image
            key={index}
            src={preview}
            alt={`Photo du projet ${projectToUpdate?.title} ${index + 1}`}
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

      <fieldset>
        <legend className="text-slate-900 mt-10">Compétences :</legend>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={skill.name}
                value={skill.name}
                {...register("skills")}
                defaultChecked={selectedSkills.includes(skill.name)}
              />
              <label htmlFor={skill.name}>{skill.name}</label>
            </div>
          ))}
        </div>
        {errors.skills && (
          <p className="text-red-500">{errors.skills.message}</p>
        )}
      </fieldset>

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
      <button className="mt-4 h-10 bg-green-500 text-black rounded-md hover:bg-green-600 transition duration-200">
        Modifier le projet
      </button>
    </form>
  );
}
