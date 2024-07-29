"use client";

import Image from "next/image";

export function WhatsappButton() {
  const handleClickWhatsapp = () => {
    window.open("https://wa.me/5491134400000", "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 flex items-center">
      {/* Visibilidad en pantallas pequeñas */}
      <button
        className=" m:hidden flex items-center bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg transition-transform transform hover:scale-105 lg:hidden px-4 py-2"
        onClick={handleClickWhatsapp}
      >
        <Image
          src="/images/web/home/whatsapp-white.svg"
          alt="WhatsApp icon"
          width={35}
          height={35}
          className="mr-2"
        />
        <span>Hablemos</span>
      </button>

      {/* Visibilidad en pantallas medianas y grandes */}
      <button
        className="hidden lg:flex items-center bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg transition-transform transform hover:scale-105 px-4 py-2"
        onClick={handleClickWhatsapp}
      >
        <Image
          src="/images/web/home/whatsapp-white.svg"
          alt="WhatsApp icon"
          width={25}
          height={25}
          className="mr-2"
        />
        Hacé tu consulta
      </button>
    </div>
  );
}
