import { useState, useRef, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MashupList from '@/components/mashup-list';
import { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

export default function Explore() {
  const [mashups, setMashups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);
  const itemsPerPage = 16;
  const { post } = useForm();

  useEffect(() => {
    // Llamada a la API para obtener los mashups
    fetch('/api/mashups')
      .then((response) => response.json())
      .then((data) => setMashups(data))
      .catch((error) => console.error('Error fetching mashups:', error));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalPages = Math.ceil(mashups.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      post('/logout');
    }, 1500);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMashups = mashups.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans relative">
      <Head title="Explorar Beats" />

      <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 z-50 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-10">DropMix</h1>
          <nav className="space-y-6">
            <ul className="flex flex-col space-y-4">
              <li><a href="/" className="hover:text-pink-500">Inicio</a></li>
              <li><a href="/explore" className="hover:text-pink-500">Explorar</a></li>
              <li><a href="/about" className="hover:text-pink-500">Sobre Nosotros</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-auto relative" ref={profileRef}>
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 p-2 rounded-lg bg-gray-700" 
            onClick={toggleMenu}>
            <img src="https://via.placeholder.com/40" alt="Usuario" className="w-10 h-10 rounded-full" />
            <span className="text-white">Usuario</span>
          </div>
          {isMenuOpen && (
            <div className="absolute bottom-full mb-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg animate-fade-in">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Perfil</li>
                <li className="px-4 py-2 hover:bg-red-600 cursor-pointer" onClick={handleLogout}>Cerrar Sesión</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="ml-64 p-6">
        <h2 className="text-3xl font-semibold text-white mb-8">Explora los mejores Beats</h2>
        <MashupList mashups={currentMashups} />

        {/* Paginación */}
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </PaginationPrevious>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  active={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </PaginationNext>
          </Pagination>
        </div>
      </div>

      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center animate-scale-in">
            <p className="text-white text-lg font-bold">Cerrando sesión...</p>
            <div className="mt-4 animate-spin h-8 w-8 border-4 border-t-transparent border-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}