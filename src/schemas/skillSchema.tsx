import {z} from "zod"

export const skillSchema = z.object({
    category: z.string().min(1, "Le champs est obligatoire"),
    name: z.string().min(1, "Le champs est obligatoire"),
    logo: z.string()
})