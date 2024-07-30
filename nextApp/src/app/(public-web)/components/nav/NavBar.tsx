"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/app/plataform/lib/utils";

import { DesktopNav } from "./DesktopNav";
import { HamburgIcon } from "./HamburgIcon";
import { LogoLink } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NicePhrase } from "./Phrase";

interface IProps {
  frase?: string;
}

export function Nav({ frase }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    console.log("CLICK ");
    setIsOpen(!isOpen);
  }

  return (
    <nav
      className={cn(
        ` fixed  flex items-center justify-between px-6 shadow-xl w-full bg-white h-[100px]  `,
      )}
    >
      <LogoLink />
      {!isOpen && <NicePhrase />}
      <HamburgIcon handler={handleToggle} openStatus={isOpen} />
      <DesktopNav />
      <MobileNav isOpen={isOpen} />
    </nav>
  );
}
