import Link from "next/link";

export function DesktopNav() {
  return (
    <div className="hidden lg:flex ">
      <ul className="flex flex-row space-x-6">
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
  );
}
