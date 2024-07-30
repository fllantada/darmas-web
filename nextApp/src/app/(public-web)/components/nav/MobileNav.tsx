import Link from "next/link";

interface IProps {
  isOpen: boolean;
}

export function MobileNav({ isOpen }: IProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="absolute top-full left-0 w-full bg-white  flex flex-col z-10 ">
      <ul className="flex flex-col items-center justify-center space-y-4 w-full z-50 bg-pink-300">
        <li>
          <Link href="/">
            <div className="text-xl py-4 text-gray-700 hover:text-primary">
              Home
            </div>
          </Link>
        </li>
        <li>
          <Link href="/ortodoncia">
            <div className="text-xl py-4 text-gray-700 hover:text-primary">
              Ortodoncia
            </div>
          </Link>
        </li>
        <li>
          <Link href="/contacto">
            <div className="text-xl py-4 text-gray-700 hover:text-primary">
              Contacto
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
