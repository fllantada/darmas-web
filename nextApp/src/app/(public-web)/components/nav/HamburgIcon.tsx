import Image from "next/image";

interface IProps {
  openStatus: boolean;
  handler: () => void;
}

export function HamburgIcon({ handler, openStatus }: IProps) {
  return (
    <button
      className="navbar-toggler flex items-center lg:hidden"
      type="button"
      onClick={handler}
      aria-expanded={openStatus}
      aria-label="Toggle navigation"
    >
      <Image
        src="/web/images/menu.svg"
        alt="Menu icon"
        width={24}
        height={24}
        className="w-6 h-6"
      />
    </button>
  );
}
