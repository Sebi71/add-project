import {z} from "zod"

export const hobbieSchema = z.object({
    category: z.string().min(1, "Le champs est requis"),
    title: z.string().min(1, "Le champs est requis"),
    resum: z.string().min(1, "Le champs est requis"),
    pictures: z.array(z.string()),
})