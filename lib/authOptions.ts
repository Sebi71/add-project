import { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/app/db/configFirebase";
import { signInWithEmailAndPassword } from "firebase/auth";

interface ExtendedUser {
  id: string; 
  email: string;
}
interface ExtendedSession extends DefaultSession {
  user: ExtendedUser;
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
              email: user.email ?? "", 
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
      session.user = {
        id: token.id as string, 
        email: token.email as string, 
      } as ExtendedUser;
      return session;
    },
  },
};

      