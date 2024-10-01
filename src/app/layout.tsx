import type { Metadata } from "next";
import localFont from "next/font/local";
import { SkillProvider } from "@/context/skillContext";
import { ProjectProvider } from "@/context/projectContext";
import { ToastContainer } from "react-toastify";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ajouter un projet",
  description: "Ajouter un projet à mon portfolio", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SkillProvider>
          <ProjectProvider>
            <ToastContainer />
            {children}
          </ProjectProvider>
          </SkillProvider>
        </body>
      </html>
  );
}
