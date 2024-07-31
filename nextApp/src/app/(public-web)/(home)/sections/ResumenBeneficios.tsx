import React from "react";

export function ResumenBeneficios() {
  return (
    <section className="container mx-auto py-16 text-center bg-primary-foreground">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center">
          <img
            src="/web/icons/saving.svg"
            alt="Icono Sin ahorros"
            className="pb-5"
          />
          <div className="text-xl font-semibold text-teal-500">
            Sin ahorros previos
          </div>
          <p className="text-gray-700">
            El paciente soló paga por su hora consultorio, No se paga por
            prestaciones ni tratamientos a realizar.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="/web/icons/time.svg"
            alt="Icono Sin demoras"
            className="pb-5"
          />
          <div className="text-xl font-semibold text-teal-500">Sin Demoras</div>
          <p className="text-gray-700">
            El paciente y el profesional se comprometen a respetar los horarios
            pactados.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src="/web/icons/professional.svg"
            alt="Icono Profesionales de calidad"
            className="pb-5"
          />
          <div className="text-xl font-semibold text-teal-500">
            Profesionales de calidad
          </div>
          <p className="text-gray-700">
            Trabajamos con especialistas calificados eliminando la burocracia
            que exige actualmente en el sistema de salud.
          </p>
        </div>
      </div>
    </section>
  );
}
