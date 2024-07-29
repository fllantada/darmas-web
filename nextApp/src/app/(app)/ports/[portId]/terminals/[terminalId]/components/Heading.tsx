"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PortType, TerminalType } from "@/generated/graphql";
import { CircleDashed } from "lucide-react";

import { cn } from "@/lib/utils";

import { TerminalDirectory } from "../sections/Directory/Directory";
import TerminalSearch from "./TerminalSearch";

import "@/../node_modules/flag-icons/css/flag-icons.min.css";

type HeadingProps = {
  className?: string;
  terminal: TerminalType;
  port: PortType;
};

export default function Heading({ className, terminal, port }: HeadingProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onNavigateToTerminal(terminalId: string) {
    if (terminalId !== terminal.id) {
      setLoading(true);
      router.push(`/ports/${port.id}/terminals/${terminalId}`);
    }
  }

  return (
    <div className={cn("flex flex-cols", className)}>
      <div className="flex items-center">
        {loading ? (
          <CircleDashed size={32} className="animate-spin" />
        ) : (
          <div
            style={{ width: 72, height: 72 }}
            className={`fi fis fi-${port.countryCode.toLocaleLowerCase()} rounded-full mr-3 border`}
            title={port.country}
          />
        )}

        <div>
          <TerminalSearch
            activeTerminal={{
              id: terminal.id,
              name: terminal.terminalCode,
              code: terminal.terminalCode,
            }}
            terminals={
              port.terminals?.map(t => ({
                id: t.id,
                code: t.terminalCode,
                name: t.terminalName,
              })) || []
            }
            onNavigateToTerminal={onNavigateToTerminal}
            disabled={loading}
          />
          <br />
          {terminal.terminalName}

          <h2 className="text-sm font-normal">
            Terminal of Port:{" "}
            <Link
              className="text-blue-700 mt-1 underline underline-offset-4 font-medium"
              href={`/ports/${port.id}`}
            >
              {port.portCode}
            </Link>
          </h2>
          <TerminalDirectory
            className="text-sm font-medium text-green-700 mt-1"
            portId={port.id}
            terminalId={terminal.id}
          />
        </div>
      </div>
    </div>
  );
}
