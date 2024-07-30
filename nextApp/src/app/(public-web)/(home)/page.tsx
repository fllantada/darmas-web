import { Metadata } from "next";

import { HomeBanner } from "./sections/HomeBanner";
import { HowWeWork } from "./sections/HowWeWork";

export const metadata: Metadata = {
  title: "Dar Mas Salud",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col ">
      <HomeBanner />
      <HowWeWork />
    </div>
  );
}
