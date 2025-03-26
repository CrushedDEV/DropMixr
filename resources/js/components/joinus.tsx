import { Button } from "@/components/ui/button";

export default function JoinUs() {
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-4xl font-semibold mb-6 text-pink-500">Únete a la Revolución del Mashup</h2>
      <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-300">
        DropMix no es solo una plataforma, es un movimiento. Haz que tu música sea escuchada y únete a miles de creadores.
      </p>
      <Button className="bg-indigo-500 text-white hover:bg-indigo-700 px-6 py-3 text-lg font-bold rounded-lg">
        Empezar Ahora
      </Button>
    </section>
  );
}
