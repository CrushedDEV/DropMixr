import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDownIcon } from "@heroicons/react/20/solid";

export default function HomePage() {
  return (
    <>
      <Head title="DropMix - Plataforma Minimalista para DJs y Productores" />
      <div className="bg-black text-white min-h-screen font-sans">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center h-screen text-center py-24 px-6 bg-gradient-to-r from-black to-gray-800">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black opacity-60"></div>
          <h1 className="relative text-6xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-pink-500 to-indigo-500 text-transparent bg-clip-text">
              Bienvenido a
            </span>{" "}
            <span className="bg-white text-black px-6 py-2 rounded-full">
              DropMix
            </span>
          </h1>
          <p className="relative text-xl max-w-2xl mx-auto mb-10">
            DropMix es la plataforma donde los DJs y productores comparten y descubren mashups. Subir tu propio mashup te da acceso a una comunidad única. ¡Colabora, descubre y haz crecer tu sonido!
          </p>
          <div className="relative flex justify-center gap-6">
            <Button asChild>
              <a href="/register" className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition duration-200">
                Regístrate y Comparte
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/login" className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black transition duration-200">
                Inicia Sesión
              </a>
            </Button>
          </div>
          
          {/* Flecha indicadora de scroll */}
          <div className="absolute bottom-10 text-white ">
            <p className="text-sm mb-2">Desliza hacia abajo para más información</p>
            <div className="mt-12 flex justify-center items-center">
          <ArrowDownIcon className="h-8 w-8 animate-bounce" />
        </div>          </div>
        </section>

        {/* Explanation Section */}
        <section className="py-24 px-6 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-6">¿Cómo Funciona DropMix?</h2>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-400">
              En DropMix, solo podrás acceder a los mashups de la comunidad si subes el tuyo. El intercambio es la clave: comparte tus mezclas y descubre nuevas inspiraciones de otros artistas. Si eres productor, ¡este es el lugar perfecto para mostrar tu creatividad!
            </p>
            <div className="flex justify-center gap-8">
              <Card className="w-full max-w-xs">
                <h3 className="text-xl font-bold text-pink-500 mb-4">Sube tu Mashup</h3>
                <p className="text-gray-400">Comparte tu mezcla original y desbloquea acceso a una colección exclusiva de mashups. El intercambio es clave.</p>
              </Card>
              <Card className="w-full max-w-xs">
                <h3 className="text-xl font-bold text-indigo-500 mb-4">Descubre Nuevas Mezclas</h3>
                <p className="text-gray-400">Accede a mashups de otros creadores y encuentra sonidos nuevos para tus sets. ¡Inspírate y crea!</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-black text-white py-8">
          <div className="max-w-6xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} DropMix. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
