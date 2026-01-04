import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight, Star, Zap } from 'lucide-react';

export default function JoinUs() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-blue-600/20"></div>
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-pink-600/30 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px]"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300 mb-8">
          <Rocket className="w-4 h-4 text-pink-400" />
          <span>Únete a miles de creadores</span>
        </div>

        {/* Title */}
        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          ¿Listo para la{' '}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            revolución
          </span>
          ?
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          DropMixr no es solo una plataforma, es un movimiento. Haz que tu música sea escuchada y conecta con la mejor comunidad de DJs.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-gray-400">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>100% Gratuito para empezar</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Zap className="w-5 h-5 text-pink-400" />
            <span>Acceso instantáneo</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Rocket className="w-5 h-5 text-purple-400" />
            <span>Créditos al registrarte</span>
          </div>
        </div>

        {/* CTA */}
        <Link href="/register">
          <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-lg px-10 py-7 shadow-2xl shadow-pink-500/25 group">
            Empezar Ahora
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        {/* Trust */}

      </div>
    </section>
  );
}
