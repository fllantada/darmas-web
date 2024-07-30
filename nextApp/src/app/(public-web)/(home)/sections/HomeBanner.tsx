import Image from "next/image";

export function HomeBanner() {
  return (
    <section className="relative flex items-center justify-center h-[300px]  text-center text-black">
      <div className="absolute inset-0">
        <Image
          src="/images/web/home/home-banner.jpg"
          alt=""
          layout="fill"
          objectFit="cover"
          quality={100}
          className="object-cover inset-0 object-left-top z-0"
        />
      </div>
      <div className="relative z-10 px-4">
        <h1 className="text-3xl font-bold md:text-5xl mb-4">
          Hecelo por vos, hacelo bien
        </h1>
        <p className="text-xl md:text-3xl">
          Más de 10.000 sonrisas felices y creciendo.
        </p>
      </div>
    </section>
  );
}
