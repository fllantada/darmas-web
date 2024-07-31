import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import Head from "next/head";

import { Nav } from "./components/nav/NavBar";
import { WhatsappButton } from "./components/WhatsappButton";
import { HomeScripts } from "./scripts";

import "./globals.css";

export const metadata = {
  title: "Dar Mas - Ortodoncia Accesible y de Calidad",
  description:
    "Dar Mas ofrece tratamientos de ortodoncia accesibles con materiales de calidad y profesionales especializados. Únete a nuestra red de especialistas o encuentra el tratamiento adecuado para ti.",
  keywords:
    "ortodoncia, tratamientos de ortodoncia, especialistas en ortodoncia, brackets accesibles, atención dental de calidad",
  author: "Dar Mas",
};

const monserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <Head>
        <title>Dar+ Salud</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />

        <title>{metadata.title}</title>
      </Head>
      <HomeScripts />

      <body className={monserrat.className + " flex flex-col min-h-screen z-0"}>
        <Nav />
        <main className="mt-[100px]">{children}</main>
        <WhatsappButton />
      </body>
    </html>
  );
}
