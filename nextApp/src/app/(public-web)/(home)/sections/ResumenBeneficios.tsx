import React from "react";

export function ResumenBeneficios() {
  return (
    <section className="container mx-auto py-12 text-center bg-primary-foreground">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center">
          <img
            src="/web/icons/saving.svg"
            alt="Icono Sin ahorros"
            className="pb-5"
          />
          <div className="text-xl font-semibold text-teal-500">
            Sin costo inicial
          </div>
          <p className="text-gray-700">
            Pagas por turno, no hay costos ocultos ni pagos iniciales altos.
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
            Especialistas en Ortodoncia
          </div>
          <p className="text-gray-700">
            Todo el equipo que forma parte de nuestra red son especialistas en
            ortodoncia y están comprometidos con la calidad de su trabajo.
          </p>
        </div>
      </div>
    </section>
  );
}
