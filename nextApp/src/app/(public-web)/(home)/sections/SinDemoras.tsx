import Image from "next/image";

export function SinDemoras() {
  return (
    <section className="py-8 px-4 bg-white flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold text-center mb-6">
        Tu tiempo vale y nosotros lo sabemos
      </h1>
      <Image
        src="/web/images/tiempo.png"
        alt="Patient Delay Icon"
        width={400}
        height={400}
        className={"mb-8 "}
      />

      <p className="text-xl text-center mb-8 text-primary font-bold ">
        atencion sin demoras…
      </p>
      <div className="flex flex-col items-center justify-start max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-start space-x-4 w-full">
          <Image
            src="/web/icons/arrow-circle.svg"
            alt="Patient Delay Icon"
            width={45}
            height={45}
          />
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Demoras del profesional (20’)
            </h2>
            <p>
              El paciente abona el 50% del valor del turno por el tiempo
              perdido.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-start space-x-4 w-full">
          <Image
            src="/web/icons/arrow-circle.svg"
            alt="Patient Delay Icon"
            width={45}
            height={45}
          />
          <div>
            <h3 className="text-xl font-semibold mb-2">
              El paciente falta sin avisar 48hs antes
            </h3>
            <p>Se cobra una penalidad por respeto al tiempo</p>
          </div>
        </div>
      </div>
    </section>
  );
}
