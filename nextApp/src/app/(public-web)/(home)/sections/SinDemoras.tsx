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
            className=" w-[45px] h-[45px]"
          />
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Demoras del profesional
            </h2>
            <p>Se hace un importante descuento por las molestias ocasionadas</p>
          </div>
        </div>

        <div className="flex items-center justify-start space-x-4 w-full">
          <Image
            src="/web/icons/arrow-circle.svg"
            alt="Patient Delay Icon"
            width={45}
            height={45}
            className=" w-[45px] h-[45px]"
          />
          <div>
            <h2 className="text-xl font-semibold mb-2">Demoras del paciente</h2>
            <p>Se cobra una penalidad por el tiempo perdido del profesional</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-md">
          <Image
            src="/web/icons/warning-alert-icon.svg"
            alt="Patient Delay Icon"
            width={35}
            height={35}
          />

          <div className="text-sm text-yellow-700">
            Podes evitar la penalidad avisando 48hs antes en caso de que tengas
            algún inconveniente para asistir a tu turno.
          </div>
        </div>
      </div>
    </section>
  );
}
