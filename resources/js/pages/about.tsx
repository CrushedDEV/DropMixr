import Header from "@/components/header";
import Footer from "@/components/footer";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Music, Heart, Globe, Sparkles, Zap, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <>
      <Head title="Sobre Nosotros" />
      <div className="bg-black min-h-screen font-sans text-white selection:bg-pink-500/30 selection:text-pink-200">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />
            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-pink-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Sparkles className="w-4 h-4" />
                <span>La evolución del DJing</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
                Sobre Nosotros
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
                DropMixr es el ecosistema definitivo para DJs y productores. Un espacio diseñado para compartir, descubrir y elevar tu creatividad musical al siguiente nivel.
              </p>
            </div>
          </section>

          {/* Mission Grid */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Comunidad Vibrante",
                  desc: "Conecta con artistas de todo el mundo. Comparte tus creaciones y recibe feedback de productores apasionados.",
                  color: "text-blue-400",
                  bg: "bg-blue-500/10"
                },
                {
                  icon: Music,
                  title: "Recursos Premium",
                  desc: "Accede a una biblioteca en constante expansión de mashups, edits y herramientas exclusivas para tus sets.",
                  color: "text-pink-400",
                  bg: "bg-pink-500/10"
                },
                {
                  icon: Zap,
                  title: "Innovación Constante",
                  desc: "Plataforma construida con tecnología de punta para garantizar la mejor experiencia de usuario y velocidad.",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10"
                }
              ].map((item, i) => (
                <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className="py-24 px-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    Nuestra <span className="text-pink-500">Visión</span>
                  </h2>
                  <div className="space-y-6 text-lg text-gray-300">
                    <p>
                      Creemos en un futuro donde la música no tiene fronteras. Donde un bedroom DJ de Buenos Aires puede colaborar con un productor de Tokio en tiempo real.
                    </p>
                    <p>
                      Nuestro objetivo es democratizar el acceso a herramientas de calidad profesional, eliminando las barreras de entrada y fomentando una cultura de remix que respeta y celebra la creatividad original.
                    </p>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold text-white">10k+</span>
                      <span className="text-sm text-gray-400">Usuarios Activos</span>
                    </div>
                    <div className="w-px bg-white/10 mx-4" />
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold text-white">50k+</span>
                      <span className="text-sm text-gray-400">Mashups Subidos</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur-2xl opacity-30 animate-pulse" />
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-white/10">
                    {/* Placeholder for a cool abstract image or studio shot */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-gray-700">
                      <Globe className="w-20 h-20 opacity-20" />
                    </div>
                    <img
                      src="/images/about/photo4.jpg"
                      alt="Visión Global"
                      className="object-cover w-full h-full opacity-60 hover:opacity-80 transition-opacity duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Creator Section */}
          <section className="py-24 px-6 bg-white/5">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12">Mente Maestra</h2>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <img
                    src="/images/about/photo5.jpg"
                    alt="Crusheed"
                    className="relative w-32 h-32 rounded-full object-cover border-2 border-black"
                    onError={(e) => {
                      e.currentTarget.src = "https://ui-avatars.com/api/?name=Crusheed&background=random";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Crusheed</h3>
                <p className="text-pink-400 font-medium mb-4">Fundador & Lead Developer</p>
                <p className="text-gray-300 max-w-lg mx-auto mb-8">
                  "Como DJ y desarrollador, sentía que faltaba algo en la escena. Una plataforma moderna, rápida y visualmente impactante. DropMixr es la respuesta a esa necesidad."
                </p>
                <Button
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={() => window.open('https://www.instagram.com/crushed_dj/', '_blank')}
                >
                  Conectar en Instagram <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">¿Listo para empezar?</h2>
              <p className="text-xl text-gray-400 mb-10">
                Únete hoy y descubre por qué miles de DJs eligen DropMixr como su fuente principal de música.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border-0">
                  Crear Cuenta Gratis
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Explorar Mashups
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
