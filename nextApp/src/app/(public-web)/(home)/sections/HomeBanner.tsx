import Image from "next/image";

export function HomeBanner() {
  return (
    <section
      className="flex items-center justify-center h-[350px]  text-center text-black "
      style={{ backgroundImage: "url(/images/web/home/home-banner.jpg)" }}
    >
      <div className=" px-4">
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