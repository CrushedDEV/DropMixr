import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head } from '@inertiajs/react';
import BeatCard from '@/components/BeatCard';  // Importamos el nuevo componente BeatCard

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Simulando un array de beats
  const beats = [...Array(30)].map((_, index) => ({
    id: index + 1,
    user: `Usuario #${index + 1}`,
    bpm: 120 + (index % 10) * 5,
    tonalidad: index % 2 === 0 ? 'C' : 'Am',
    image: `https://via.placeholder.com/350x150?text=Mashup+${index + 1}`,
    audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`
  }));

  const totalPages = Math.ceil(beats.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePlayPause = (index: number) => {
    const audio = document.getElementById(`audio-${index}`) as HTMLAudioElement;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  // Paginación: mostrar solo los beats correspondientes a la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBeats = beats.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans">
      <Head title="Explorar Beats" />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 z-50">
        <h1 className="text-2xl font-bold mb-10">DropMix</h1>
        <nav className="space-y-6">
          <ul className="flex flex-col space-y-4">
            <li>
              <a href="/" className="hover:text-pink-500">Inicio</a>
            </li>
            <li>
              <a href="/explore" className="hover:text-pink-500">Explorar</a>
            </li>
            <li>
              <a href="/about" className="hover:text-pink-500">Sobre Nosotros</a>
            </li>
          </ul>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Género</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded-md w-full"
                >
                  <option value="">Todos</option>
                  <option value="reggaeton">Reguetón</option>
                  <option value="hip-hop">Hip-Hop</option>
                  <option value="electronic">Electrónica</option>
                  <option value="pop">Pop</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ordenar por</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded-md w-full"
                >
                  <option value="newest">Más Nuevos</option>
                  <option value="popular">Más Populares</option>
                  <option value="best-rated">Mejor Valorados</option>
                </select>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="flex justify-between mb-8">
          <div className="flex items-center">
            <h2 className="text-3xl font-semibold text-white">Explora los mejores Beats</h2>
            <Button className="ml-4 bg-indigo-600 text-white hover:bg-indigo-700">
              Subir Beat
            </Button>
          </div>
          <div className="flex gap-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar Beats"
              className="bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              Buscar
            </Button>
          </div>
        </div>

        {/* Beats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentBeats.map((beat, index) => (
            <BeatCard
              key={beat.id}
              id={beat.id}
              user={beat.user}
              bpm={beat.bpm}
              tonalidad={beat.tonalidad}
              image={beat.image}
              audio={beat.audio}
              onPlayPause={handlePlayPause}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                href="#"
                disabled={currentPage === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                href="#"
                disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center border-t border-gray-700 mt-12">
        <p>&copy; {new Date().getFullYear()} DropMix. Todos los derechos reservados.</p>
        <p className="text-gray-400 text-sm mt-2">Síguenos en nuestras redes sociales</p>
      </footer>
    </div>
  );
}
