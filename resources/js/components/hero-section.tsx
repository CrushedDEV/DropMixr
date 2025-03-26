import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen text-center py-24 px-6">
      <h1 className="text-6xl font-extrabold leading-tight mb-6">
        <span className="bg-gradient-to-r from-pink-500 to-indigo-500 text-transparent bg-clip-text">
          Bienvenido a
        </span>{" "}
        <span className="bg-white text-black px-6 py-2 rounded-full">
          DropMix
        </span>
      </h1>
      <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-300">
        DropMix es la plataforma donde los DJs y productores comparten y descubren mashups. ¡Colabora, descubre y haz crecer tu sonido!
      </p>
      <div className="flex justify-center gap-4">
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700" asChild>
          <a href="/register">Regístrate y Comparte</a>
        </Button>
        <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300" asChild>
          <a href="/login">Inicia Sesión</a>
        </Button>
      </div>
      <div className="absolute bottom-10 text-white">
        <p className="text-sm mb-2">Desliza hacia abajo para más información</p>
        <div className="mt-12 flex justify-center items-center">
          <ArrowDownIcon className="h-8 w-8 text-pink-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
