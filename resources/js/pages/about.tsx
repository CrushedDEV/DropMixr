import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UsersIcon, MusicIcon, HeartIcon } from "lucide-react";
import Header from "@/components/header";

export default function About() {
  return (
    <>
      <Head title="Sobre Nosotros" />
      <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen font-sans">
        <Header />
        <main className="pt-24 px-6">
          <section className="flex flex-col lg:flex-row items-center justify-between py-24">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-6">Sobre Nosotros</h1>
              <p className="text-lg max-w-2xl mx-auto lg:mx-0 mb-10 text-gray-300">
                DropMix es una comunidad creada por y para DJs y productores. Nuestra misión es proporcionar un espacio donde compartir, descubrir y colaborar en mashups, versiones extendidas y más.
              </p>
            </div>
            <img src="images/about/photo1.jpg" alt="Comunidad de DJs" className="lg:w-1/2 rounded-lg shadow-lg" />
          </section>

          <section className="flex flex-col lg:flex-row-reverse items-center justify-between py-24 bg-gray-800 px-6">
            <div className="lg:w-1/2 text-center lg:text-left ml-24">
              <h2 className="text-4xl font-semibold mb-6 text-pink-500">Cómo Funciona</h2>
              <p className="text-lg mb-8 text-gray-300">
                En DropMix, la colaboración es la clave. Para poder descargar mashups de otros artistas, primero debes contribuir con tus propias creaciones. Esto garantiza que la plataforma se mantenga siempre fresca y llena de contenido de calidad.
              </p>
            </div>
            <img src="images/about/photo2.jpg" alt="Funcionamiento" className="lg:w-1/2 rounded-lg shadow-lg" />
          </section>

          <section className="flex flex-col items-center justify-between py-24 px-6">
            <h2 className="text-4xl font-semibold mb-6 text-pink-500">Nuestros Valores</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-3xl text-center">
              Creemos en la colaboración, la accesibilidad y la innovación. Buscamos ofrecer a los DJs herramientas de alta calidad sin barreras, promoviendo la creatividad y el crecimiento profesional de nuestra comunidad.
            </p>
            <img src="images/about/photo3.jpg" alt="Valores" className="w-full max-w-lg rounded-lg shadow-lg" />
          </section>

          <section className="flex flex-col lg:flex-row items-center justify-between py-24 bg-gray-800 px-6">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl font-semibold mb-6 text-pink-500">Nuestra Visión</h2>
              <p className="text-lg mb-8 text-gray-300">
                Crear una de las mayores bibliotecas de mashups y recursos DJ, permitiendo a artistas de todo el mundo acceder a herramientas de calidad sin coste alguno, fomentando la cultura del remix y la creatividad musical.
              </p>
            </div>
            <img src="images/about/photo4.jpg" alt="Visión" className="w-1/3 rounded-lg shadow-lg" />
          </section>

          <section className="flex flex-col items-center justify-between py-24 px-6">
            <h2 className="text-4xl font-semibold mb-6 text-pink-500">Únete a Nosotros</h2>
            <p className="text-lg mb-8 text-gray-300 max-w-3xl text-center">
              Formar parte de DropMix significa acceder a una comunidad vibrante de DJs y productores. Comparte tu música, colabora con otros artistas y ayuda a hacer crecer esta plataforma con contenido exclusivo.
            </p>
            <Button className="bg-indigo-500 text-white hover:bg-indigo-700 px-6 py-3 text-lg font-bold rounded-lg">
              Explorar
            </Button>
          </section>

          <section className="flex flex-col items-center justify-between py-24 bg-gray-800 px-6">
            <h2 className="text-4xl font-semibold mb-6 text-pink-500">Sobre el Creador</h2>
            <Card className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <img src="images/about/photo5.jpg" alt="Creador" className="h-3/5 rounded-full mx-auto mb-4" />
              <h3 className="text-2xl font-bold">crusheed</h3>
              <p className="text-gray-400 mb-4">Dj y desarrolador, buscando conectar a la comunidad DJ con herramientas innovadoras.</p>
              <Button className="bg-pink-500 text-white hover:bg-pink-700 px-4 py-2 text-lg font-bold rounded-lg" onClick={() => window.open('https://www.instagram.com/crushed_dj/', '_blank')}>
                    Conectar
              </Button>
            </Card>
          </section>
        </main>

        <footer className="bg-gray-900 text-white py-8 text-center border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} DropMix. Todos los derechos reservados.</p>
        </footer>
      </div>
    </>
  );
}
