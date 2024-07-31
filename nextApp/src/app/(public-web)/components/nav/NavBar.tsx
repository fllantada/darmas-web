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

interface IProps {}

export function Nav({}: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    console.log("CLICK ");
    setIsOpen(!isOpen);
  }
  function handlerClick() {
    setIsOpen(false);
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
      <DesktopNav handler={handlerClick} />
      <MobileNav handler={handlerClick} isOpen={isOpen} />
    </nav>
  );
}
