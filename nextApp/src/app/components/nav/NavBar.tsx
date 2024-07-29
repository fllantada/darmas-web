"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface IProps {
  frase?: string;
}

export function Nav({ frase }: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  return (
    <header
      className={`bg-white relative ${
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
        <div
          className={`flex items-center justify-center max-sm:hidden  ${isOpen ? "hidden" : ""} `}
        >
          <p className="font-['Roboto'] italic text-2xl text-gray-400">
            {frase}
          </p>
        </div>

        <button
          className="navbar-toggler flex items-center lg:hidden"
          type="button"
          onClick={handleToggle}
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
          className={`lg:flex lg:items-center lg:space-x-6 lg:static lg:top-auto lg:left-auto lg:w-auto lg:bg-transparent lg:border-none lg:max-h-none ${
            isOpen
              ? "absolute top-full left-0 w-full bg-white max-h-96 flex flex-col transition-all duration-500 ease-in-out"
              : "hidden"
          }`}
          id="navbarTogglerDemo02"
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6">
            <li>
              <Link href="/">
                <div className="text-xl text-center  lg:text-2xl py-4 text-gray-700 hover:text-primary">
                  Home
                </div>
              </Link>
            </li>
            <li>
              <Link href="/ortodoncia">
                <div className="text-xl text-center lg:text-2xl py-4 text-gray-700 hover:text-primary">
                  Ortodoncia
                </div>
              </Link>
            </li>
            <li>
              <Link href="/contacto">
                <div className="text-xl text-center  lg:text-2xl py-4 text-gray-700 hover:text-primary">
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
