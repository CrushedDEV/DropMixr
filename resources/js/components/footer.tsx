export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-8 text-center border-t border-gray-700">
        <p>&copy; {new Date().getFullYear()} DropMix. Todos los derechos reservados.</p>
        <p className="text-gray-400 text-sm mt-2">Síguenos en nuestras redes sociales para más novedades.</p>
      </footer>
    );
  }
  