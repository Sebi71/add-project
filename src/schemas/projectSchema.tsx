import {z} from "zod";

const skillSchema = z.object({
    name: z.string().min(1, "Le champs est requis")
})

export const projectSchema = z.object({
    type: z.enum(["cours", "personnel"]),
    category: z.string().min(1, "Le champs est requis"),
    title: z.string().min(1, "Le champs est requis"),
    resum: z.string().min(1, "Le champs est requis"),
    cover: z.string().min(1, "Le champs est requis"),
    pictures: z.array(z.string().min(1, "Le champs est requis")),
    description: z.string().min(1, "Le champs est requis"),
    skills: z.array(skillSchema),
    githubLink: z.string().min(1, "Le champs est requis"),
    liveLink: z.string().optional(),
})