// src/components/Nav.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { WhatsappButton } from "./whatsappButton";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  function handleClickWhatsapp() {
    window.open("https://wa.me/5491134400000", "_blank");
  }

  return (
    <header
      className={`bg-white relative  ${
        isOpen ? "border-b-0" : "border-b border-gray-200"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/">
          <div>
            <Image
              src="/images/web/home/darmassalud.svg"
              alt="Logotipo Dar+ Salud"
              width={150}
              height={40}
              className="w-auto h-auto"
            />
          </div>
        </Link>

        <WhatsappButton />

        <button
          className="navbar-toggler flex items-center lg:hidden"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarTogglerDemo02"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <Image
            src="/images/web/general/menu.svg"
            alt="Menu icon"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
        <div
          className={`lg:flex lg:items-center lg:space-x-6 absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:border-none  overflow-hidden ${
            isOpen
              ? "max-h-96 flex justify-center items-center  transition-all duration-500 ease-in-out"
              : "max-h-0"
          }`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6">
            <li>
              <Link href="/">
                <div className="text-gray-700 hover:text-blue-500">Home</div>
              </Link>
            </li>
            <li>
              <Link href="/ortodoncia">
                <div className="text-gray-700 hover:text-blue-500">
                  Ortodoncia
                </div>
              </Link>
            </li>
            <li>
              <Link href="/odontologia">
                <div className="text-gray-700 hover:text-blue-500">
                  Odontología
                </div>
              </Link>
            </li>
            <li>
              <Link href="/oftalmologia">
                <div className="text-gray-700 hover:text-blue-500">
                  Oftalmología
                </div>
              </Link>
            </li>
            <li>
              <Link href="/contacto">
                <div className="text-gray-700 hover:text-blue-500">
                  Contacto
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
