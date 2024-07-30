import Link from "next/link";

interface IProps {
  isOpen: boolean;
  handler: () => void;
}

export function MobileNav({ isOpen, handler }: IProps) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="absolute top-full left-0 w-full bg-white  flex flex-col z-10 ">
      <ul className="flex flex-col items-center justify-center space-y-4 w-full z-50 bg-pink-300">
        <li>
          <Link href="/" onClick={handler}>
            <div className="text-xl py-4 text-gray-700 hover:text-primary">
              Home
            </div>
          </Link>
        </li>
        <li>
          <Link href="/ortodoncia" onClick={handler}>
            <div className="text-xl py-4 text-gray-700 hover:text-primary">
              Ortodoncia
            </div>
          </Link>
        </li>
        <li>
          <Link href="/contacto" onClick={handler}>
            <div className="text-xl py-4 text-gray-700 hover:text-primary">
              Contacto
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
