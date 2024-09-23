import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email("Format invalide").min(1,"Email utilisateur requis"),
    password: z.string().min(1, "Mot de passe obligatoire")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[@#$!%*?&.,;:()_+={}~-]/, "Le mot de passe doit contenir au moins un caractère spécial")
    .min(8,"Mot de passe trop court"),
})