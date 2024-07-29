"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDashed } from "lucide-react";

import { cn } from "@/app/plataform/lib/utils";

import Directory from "../sections/directoryWidget/Directory";
import PortSearch from "./PortSearch";

import "@/../node_modules/flag-icons/css/flag-icons.min.css";

type HeadingProps = {
  className?: string;
  activePort: any;
  ports: any[];
  countryCode: string;
};

export default function Heading({
  className,
  activePort,
  ports,
  countryCode,
}: HeadingProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onNavigateToPort(portId: string) {
    if (portId !== activePort.id) {
      setLoading(true);
      router.push(`/ports/${portId}`);
    }
  }

  return (
    <div className={cn("flex flex-cols", className)}>
      <div className="flex items-center">
        {loading ? (
          <div className="rounded-full bg-slate-200 p-5 mr-3">
            <CircleDashed size={32} className="animate-spin" />
          </div>
        ) : (
          <div
            style={{ width: 72, height: 72 }}
            className={`fi fis fi-${activePort.countryCode.toLocaleLowerCase()} rounded-full mr-3 border`}
            title={activePort.country}
          />
        )}
        <div>
          <PortSearch
            activePort={activePort}
            ports={ports}
            disabled={loading}
            onNavigateToPort={onNavigateToPort}
            className="mb-2"
          />
          <h2 className="text-sm font-normal">{activePort.portName}</h2>
          <Directory
            className="text-sm font-medium text-green-700 mt-1"
            countryCode={countryCode}
            portCode={activePort.portCode}
          />
        </div>
      </div>
    </div>
  );
}
