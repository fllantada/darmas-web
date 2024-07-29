// src/components/Nav.tsx

import Image from "next/image";
import Link from "next/link";

const Nav = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="https://www.darmas.com.ar/">
          <div>
            <Image
              src="/darmassalud.svg"
              alt="Logotipo Dar+ Salud"
              width={150}
              height={40}
              className="w-auto h-auto"
            />
          </div>
        </Link>
        <button
          className="navbar-toggler flex items-center lg:hidden"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <Image
            src="/menu.svg"
            alt="Menu icon"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
        <div
          className="navbar-collapse hidden lg:flex lg:items-center lg:space-x-6"
          id="navbarTogglerDemo02"
        >
          <ul className="flex space-x-6">
            <li>
              <Link href="https://www.darmas.com.ar/">
                <div className="text-gray-700 hover:text-blue-500">Home</div>
              </Link>
            </li>
            <li>
              <Link href="https://www.darmas.com.ar/ortodoncia">
                <div className="text-gray-700 hover:text-blue-500">
                  Ortodoncia
                </div>
              </Link>
            </li>
            <li>
              <Link href="https://www.darmas.com.ar/odontologia">
                <div className="text-gray-700 hover:text-blue-500">
                  Odontología
                </div>
              </Link>
            </li>
            <li>
              <Link href="https://www.darmas.com.ar/oftalmologia">
                <div className="text-gray-700 hover:text-blue-500">
                  Oftalmología
                </div>
              </Link>
            </li>
            <li>
              <Link href="https://www.darmas.com.ar/contacto">
                <div className="text-gray-700 hover:text-blue-500">
                  Contacto
                </div>
              </Link>
            </li>
          </ul>
        </div>
        {/*         <div className="hidden lg:flex lg:items-center">
          <button
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() =>
              window.open(
                "https://api.whatsapp.com/send?phone=5491158833835&text=Hola, ví su web y me interesa saber más del servicio",
                "_blank",
              )
            }
          >
            <Image
              src="/whatsapp-white.svg"
              alt="WhatsApp icon"
              width={25}
              height={25}
              className="mr-2"
            />
            Hacé tu consulta
          </button>
        </div> */}
      </nav>
    </header>
  );
};

export default Nav;
