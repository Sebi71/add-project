// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Ajoute le type pour l'ID
      email: string;
      // d'autres propriétés si nécessaire
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Ajoute le type pour l'ID
    email: string;
    // d'autres propriétés si nécessaire
  }
}
