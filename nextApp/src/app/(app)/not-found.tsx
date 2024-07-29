import { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Not Found",
};

export default function NotFound() {
  return (
    <div className="text-center">
      <AlertCircle size={70} className="text-slate-400 inline-block mb-3" />
      <h2 className="font-bold text-6xl">404</h2>
      <div className="text-xl">Page not found</div>
    </div>
  );
}
