export default function Header() {
    return (
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/50 text-white p-4 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold">DropMix</h1>
        <nav className="flex items-center gap-8">
          <ul className="flex gap-6 text-lg">
            <li><a href="/" className="hover:text-pink-500 transition">Inicio</a></li>
            <li><a href="/explore" className="hover:text-pink-500 transition">Explorar</a></li>
            <li><a href="/about" className="hover:text-pink-500 transition">Sobre Nosotros</a></li>
          </ul>
          <div className="flex items-center gap-4">
            <a href="/login" className="border border-pink-500 text-pink-500 px-4 py-2 rounded-lg hover:bg-pink-500 hover:text-white transition-all">Iniciar Sesión</a>
            <a href="/register" className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-all">Regístrate</a>
          </div>
        </nav>
      </header>
    );
  }
  