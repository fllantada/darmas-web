import { useEffect, useState } from "react";

export function NicePhrase() {
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    // Genera el índice aleatorio solo en el cliente
    const index = Math.floor(Math.random() * frases.length);
    setRandomIndex(index);
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez

  if (randomIndex === null) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className={`flex items-center justify-center max-sm:hidden   `}>
      <p className="font-['Roboto'] italic text-2xl text-gray-400">
        {frases[randomIndex]}
      </p>
    </div>
  );
}

const frases = [
  "Cuida tu cuerpo, es el único.",
  "Salud es riqueza, cuídala.",
  "Ama tu salud, es tu vida.",
  "Tu bienestar es tu tesoro.",
  "Vive sano, vive feliz.",
  "El primer paso es cuidar.",
  "Salud es amor propio.",
  "Equilibrio es felicidad.",
  "Bienestar empieza en ti.",
  "Escucha a tu cuerpo siempre.",
  "Tu salud, tu prioridad.",
  "Cuida tu mente y cuerpo.",
  "Vive con energía positiva.",
  "Elige salud cada día.",
  "Cada día cuenta, cuida.",
  "Tu cuerpo merece amor.",
  "Invierte en tu bienestar.",
  "Respira, vive, sonríe.",
  "Sé amable contigo mismo.",
  "Mantén la calma y cuida.",
  "Pequeños pasos, gran salud.",
  "Cada comida es un regalo.",
  "Bebe agua, siéntete bien.",
  "Descanso es vital.",
  "Hazlo por ti, siempre.",
  "Cuidado personal es amor.",
  "Energía positiva, salud.",
  "Salud es felicidad diaria.",
  "Tu salud es tu poder.",
  "Cada día es una oportunidad.",
  "Cuida tu mente y cuerpo.",
  "Elige lo mejor para ti.",
  "Respira profundamente hoy.",
  "Sé positivo, sé saludable.",
  "Salud es tu mayor riqueza.",
  "Sigue tus sueños sanamente.",
  "Enfócate en tu bienestar.",
  "Haz de tu salud una meta.",
  "Cuida lo que más quieres.",
  "Vive con plenitud y salud.",
  "Tu salud es tu mayor activo.",
  "Bienestar es una elección.",
  "Cuida tu cuerpo, es único.",
  "Cada momento es para cuidarte.",
  "Vive saludablemente hoy.",
  "Haz de la salud una rutina.",
  "Tu bienestar es fundamental.",
  "La salud es felicidad duradera.",
  "Recupera tu energía diaria.",
  "La calma mejora tu salud.",
  "El bienestar es un viaje.",
  "Valora cada pequeño logro.",
  "Salud es equilibrio diario.",
];
