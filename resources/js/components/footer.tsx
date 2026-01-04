import { Link } from '@inertiajs/react';
import { Music, Instagram, Twitter, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DropMixr</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              La plataforma donde los DJs y productores comparten y descubren mashups exclusivos.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              <a href="https://instagram.com/crushed_dj" target="_blank" rel="noopener" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-3">
              <li><Link href="/explore" className="text-gray-400 hover:text-white transition-colors">Explorar</Link></li>
              <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/login" className="text-gray-400 hover:text-white transition-colors">Iniciar Sesión</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Información</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DropMixr. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-pink-500" /> por crushed
          </p>
        </div>
      </div>
    </footer>
  );
}