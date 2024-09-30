// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { auth } from "@/app/db/configFirebase";
// import { signInWithEmailAndPassword } from "firebase/auth";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "credentials",
//             credentials: {
//               email: { label: "email", type: "email" },
//               password: { label: "password", type: "password" },
//             },
//             async authorize(
//               credentials: Record<"email" | "password", string> | undefined,
//               req: any
//             ) {
//               if (!credentials) {
//                 return null;
//               }
//               try {
//                 const userCredential = await signInWithEmailAndPassword(
//                   auth,
//                   credentials.email,
//                   credentials.password
//                 );
//                 const user = userCredential.user;
//                 console.log("authoption Utilisateur connecté :", user);
      
//                 if (user) {
//                   return {
//                     id: user.uid,
//                     email: user.email,
//                   };
//                 } else {
//                   return null;
//                 }
//               } catch (error: any) {
//                 console.error(error.message);
//                 return null;
//               }
//             },
//           }),
//         ],
//         session: {
//           strategy: "jwt",
//           maxAge: 30 * 24 * 60 * 60, 
//       },
//         callbacks: {
//           jwt: async ({ user, token, trigger, session }) => {
//             if (trigger === "update") {
//               return { ...token, ...session.user };
//             }
//             return { ...token, ...user };
//           },
//         },
//       };
      
import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/app/db/configFirebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Définir un type utilisateur étendu
interface ExtendedUser {
  id: string; // ID de l'utilisateur
  email: string; // Email de l'utilisateur
}

// Définir l'interface pour la session
interface ExtendedSession extends DefaultSession {
  user: ExtendedUser; // Étendre l'utilisateur pour inclure l'ID
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<ExtendedUser | null> {
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

          if (user) {
            return {
              id: user.uid,
              email: user.email ?? "", // Assurez-vous que c'est une chaîne
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
    async session({ session, token }): Promise<ExtendedSession> {
      // Assurez-vous que l'utilisateur existe dans la session
      session.user = {
        id: token.id as string, // Assurez-vous que c'est une chaîne
        email: token.email as string, // Assurez-vous que c'est une chaîne
      } as ExtendedUser; // Utilisez le type étendu ici
      return session;
    },
  },
};

      