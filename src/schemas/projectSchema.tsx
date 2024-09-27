import {z} from "zod";

export const projectSchema = z.object({
    type: z.string().min(1, "Le champs est obligatoire"),
    date: z.string().transform((val) => new Date(val)),
    category: z.string().min(1, "Le champs est requis"),
    title: z.string().min(1, "Le champs est requis"),
    resum: z.string().min(1, "Le champs est requis"),
    cover: z.string(),
    pictures: z.array(z.string()),
    description: z.string().min(1, "Le champs est requis"),
    skills: z.array(z.string()),
    githubLink: z.string().min(1, "Le champs est requis"),
    liveLink: z.string().optional(),
})