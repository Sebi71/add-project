import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFirebaseHobbie } from "@/context/hobbieContext"; //
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/db/configFirebase";
import { useState, useRef } from "react";
import { HobbieFormData } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { hobbieSchema } from "@/schemas/hobbieSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddHobbie() {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { addHobbie } = useFirebaseHobbie();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HobbieFormData>({
    resolver: zodResolver(hobbieSchema),
    defaultValues: {
      category: "",
      title: "",
      resum: "",
      pictures: [],
    },
  });

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

  const onSubmit: SubmitHandler<HobbieFormData> = async (data) => {
    try {
      let previews: string[] = [];

      const uploadImage = async (file: File) => {
        const uniqueFileName = `${uuidv4()}_${file.name.replace(/\s+/g, "_")}`; // Générer un nom unique
        const imageRef = ref(storage, `hobbies/${uniqueFileName}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      };

      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(uploadImage);
        previews = await Promise.all(uploadPromises);
      }

      await addHobbie({
        ...data,
        pictures: previews,
      });

      setImagePreview([]);
      setImageFiles([]);
      toast.success("Projet ajouté avec succès");
      router.push("/hobbies");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[700px] m-auto mt-10 mb-10 flex flex-col gap-2 bg-slate-50 p-5 rounded-md shadow-md"
    >
      <label htmlFor="category" className="text-slate-900 mt-10">
        Catégorie de projet :
      </label>
      <select
        id="category"
        {...register("category")}
        className="h-10 border border-slate-900 rounded-md"
      >
        <option value="">Sélectionnez une catégorie</option>
        <option value='Travaux'>Travaux</option>
        <option value="Meubles">Meubles</option>
        <option value="Chantournages">Chantournages</option>
        <option value="Réparations">Réparations</option>
        <option value="Autres">Autres</option>
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
            alt="image du projet"
            width={1024}
            height={200}
            onClick={() => removeImage(index)}
          />
        ))}
      </div>

      <button className="mt-4 h-10 bg-green-500 text-black rounded-md hover:bg-green-600 transition duration-200">
        Envoyer à la BDD
      </button>
    </form>
  );
}
