import type { Metadata } from "next";
import localFont from "next/font/local";
import { SkillProvider } from "@/context/skillContext";
import { ProjectProvider } from "@/context/projectContext";
import { HobbieProvider } from "@/context/hobbieContext";
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
      <head>
        {/* Preconnect to important third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googleapis.com" />
      </head>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkillProvider>
          <ProjectProvider>
            <HobbieProvider>
              <ToastContainer />
              {children}
            </HobbieProvider>
          </ProjectProvider>
        </SkillProvider>
      </body>
    </html>
  );
}
