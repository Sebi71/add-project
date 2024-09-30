import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/app/db/configFirebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
              email: { label: "email", type: "email" },
              password: { label: "password", type: "password" },
            },
            async authorize(
              credentials: Record<"email" | "password", string> | undefined,
              req: any
            ) {
              if (!credentials) {
                return null;
              }
              try {
                const userCredential = await signInWithEmailAndPassword(
                  auth,
                  credentials.email,
                  credentials.password
                );
                const user = userCredential.user;
                console.log("authoption Utilisateur connecté :", user);
      
                if (user) {
                  return {
                    id: user.uid,
                    email: user.email,
                  };
                } else {
                  return null;
                }
              } catch (error: any) {
                console.error(error.message);
                return null;
              }
            },
          }),
        ],
        session: {
          strategy: "jwt",
          maxAge: 30 * 24 * 60 * 60, 
      },
        callbacks: {
          jwt: async ({ user, token, trigger, session }) => {
            if (trigger === "update") {
              return { ...token, ...session.user };
            }
            return { ...token, ...user };
          },
        },
      };
      
 
      