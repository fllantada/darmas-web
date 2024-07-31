import { Metadata } from "next";

import { Footer } from "../components/Footer";
import { HomeBanner } from "./sections/HomeBanner";
import { MismoProfesional } from "./sections/MismoProfesional";
import { SinDemoras } from "./sections/SinDemoras";

export const metadata: Metadata = {
  title: "Dar Mas Salud",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col ">
      <HomeBanner />
      <MismoProfesional />
      <SinDemoras />
      <Footer />
    </div>
  );
}
