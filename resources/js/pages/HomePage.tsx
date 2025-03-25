import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, MusicIcon, UsersIcon, UploadCloudIcon } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Head title="DropMix" />
      <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen font-sans">
        <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/50 text-white p-4 flex justify-between items-center z-50">
          <h1 className="text-2xl font-bold">DropMix</h1>
          <nav>
            <ul className="flex gap-4">
              <li><a href="/" className="hover:text-pink-500">Inicio</a></li>
              <li><a href="/explore" className="hover:text-pink-500">Explorar</a></li>
              <li><a href="/about" className="hover:text-pink-500">Sobre Nosotros</a></li>
            </ul>
          </nav>
        </header>

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

        <section className="py-24 px-6 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-indigo-400">¿Cómo Funciona DropMix?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-300">
            En DropMix, solo podrás acceder a los mashups de la comunidad si subes el tuyo. Comparte tus mezclas y descubre nuevas inspiraciones.
          </p>
          <div className="flex justify-center gap-8">
            <Card className="w-full max-w-xs bg-gray-900 border border-indigo-500">
              <CardContent className="flex flex-col items-center text-center">
                <UploadCloudIcon className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">Sube tu Mashup</h3>
                <p className="text-gray-300">Comparte tu mezcla original y desbloquea acceso a una colección exclusiva de mashups.</p>
              </CardContent>
            </Card>
            <Card className="w-full max-w-xs bg-gray-900 border border-indigo-500">
              <CardContent className="flex flex-col items-center text-center">
                <MusicIcon className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">Descubre Nuevas Mezclas</h3>
                <p className="text-gray-300">Accede a mashups de otros creadores y encuentra sonidos nuevos para tus sets.</p>
              </CardContent>
            </Card>
            <Card className="w-full max-w-xs bg-gray-900 border border-indigo-500">
              <CardContent className="flex flex-col items-center text-center">
                <UsersIcon className="h-12 w-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">Conéctate con Otros DJs</h3>
                <p className="text-gray-300">Forma parte de una comunidad exclusiva de DJs y productores apasionados.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-24 px-6 text-center">
          <h2 className="text-4xl font-semibold mb-6 text-pink-500">Únete a la Revolución del Mashup</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-300">
            DropMix no es solo una plataforma, es un movimiento. Haz que tu música sea escuchada y únete a miles de creadores.
          </p>
          <Button className="bg-indigo-500 text-white hover:bg-indigo-700 px-6 py-3 text-lg font-bold rounded-lg">
            Empezar Ahora
          </Button>
        </section>

        <footer className="bg-gray-900 text-white py-8 text-center border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} DropMix. Todos los derechos reservados.</p>
          <p className="text-gray-400 text-sm mt-2">Síguenos en nuestras redes sociales para más novedades.</p>
        </footer>
      </div>
    </>
  );
}
