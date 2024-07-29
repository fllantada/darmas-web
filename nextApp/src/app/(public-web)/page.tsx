import { Metadata } from "next";
import { redirect } from "next/navigation";

import { HomeBanner } from "./components/HomeBanner";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <HomeBanner />
    </>
  );
}
