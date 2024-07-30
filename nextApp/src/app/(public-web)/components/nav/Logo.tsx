import Image from "next/image";
import Link from "next/link";

export function LogoLink() {
  return (
    <Link href="/">
      <Image
        src="/images/web/home/darmassalud.svg"
        alt="Logotipo Dar+ Salud"
        width={150}
        height={40}
        className="w-auto h-auto"
      />
    </Link>
  );
}
