import { ReactNode } from "react";
import Head from "next/head";

import LeftBar from "@/components/SideBar";

import { Nav } from "./nav";
import { HomeScripts } from "./scripts";

import "./globals.css";

/* import "./custom.css"; */

export const metadata = {
  title: "Dar Mas - Ortodoncia Accesible y de Calidad",
  description:
    "Dar Mas ofrece tratamientos de ortodoncia accesibles con materiales de calidad y profesionales especializados. Únete a nuestra red de especialistas o encuentra el tratamiento adecuado para ti.",
  keywords:
    "ortodoncia, tratamientos de ortodoncia, especialistas en ortodoncia, brackets accesibles, atención dental de calidad",
  author: "Dar Mas",
  viewport: "width=device-width, initial-scale=1",
  // Puedes agregar más metadatos aquí según sea necesario
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <Head>
        <title>Dar+ Salud</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content={metadata.viewport} />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="www.darmas.com.ar" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/images/twitter-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/global.css" />
        <title>{metadata.title}</title>
      </Head>
      <HomeScripts />

      <body>
        <Nav />
        <div className="bg-secondary">{children}</div>
        <div className="h-[500px] bg-green-200 "></div>
        <div className="h-[500px] bg-secondary "></div>
        <div className="h-[500px] bg-green-200 "></div>
        <div className="h-[500px] bg-secondary "></div>
        <div className="h-[500px] bg-green-200 "></div>
      </body>
    </html>
  );
}
