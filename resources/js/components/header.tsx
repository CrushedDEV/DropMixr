import { Link } from '@inertiajs/react';
import { Music, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="mx-4 mt-4">
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-shadow">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DropMixr
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all"></span>
              </Link>
              <Link
                href="/explore"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Explorar
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all"></span>
              </Link>
              <Link
                href="/onboarding"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Cómo funciona
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all"></span>
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors relative group"
              >
                Sobre Nosotros
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all"></span>
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-pink-500/20 transition-all hover:shadow-pink-500/30"
              >
                Regístrate
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2">
                  Inicio
                </Link>
                <Link href="/explore" className="text-gray-300 hover:text-white transition-colors py-2">
                  Explorar
                </Link>
                <Link href="/onboarding" className="text-gray-300 hover:text-white transition-colors py-2">
                  Cómo funciona
                </Link>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors py-2">
                  Sobre Nosotros
                </Link>
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <Link href="/login" className="text-center py-2 text-gray-300 hover:text-white">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="text-center py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-medium">
                    Regístrate
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}