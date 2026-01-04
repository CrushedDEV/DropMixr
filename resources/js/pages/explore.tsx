import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import MashupList from '@/components/mashup-list';
import { Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Search, X, Plus, Music, Loader, Sparkles, SlidersHorizontal, ChevronDown, Grid3X3, List } from 'lucide-react';

interface Mashup {
  id: number;
  title: string;
  bpm?: number;
  key?: string;
  duration?: number;
  description?: string;
  image?: string;
  file_path?: string;
  audio?: string;
  user?: {
    name: string;
  };
  created_at?: string;
}

export default function Explore() {
  const [mashups, setMashups] = useState<Mashup[]>([]);
  const [filteredMashups, setFilteredMashups] = useState<Mashup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [bpmRange, setBpmRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const itemsPerPage = viewMode === 'grid' ? 20 : 15;

  const sortOptions = [
    { value: 'recent', label: 'Más Recientes' },
    { value: 'oldest', label: 'Más Antiguos' },
    { value: 'title-asc', label: 'Título A-Z' },
    { value: 'title-desc', label: 'Título Z-A' },
    { value: 'author-asc', label: 'Autor A-Z' },
    { value: 'author-desc', label: 'Autor Z-A' },
    { value: 'bpm-asc', label: 'BPM ↑' },
    { value: 'bpm-desc', label: 'BPM ↓' },
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch('/mashups')
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching mashups');
        return response.json();
      })
      .then((data: Mashup[]) => {
        setMashups(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((error: Error) => {
        console.error('Error fetching mashups:', error);
        setError('No se pudieron cargar los mashups');
        setMashups([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let filtered = mashups;

    if (searchQuery.trim()) {
      filtered = filtered.filter((mashup) =>
        mashup.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mashup.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mashup.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // BPM range filter
    filtered = filtered.filter((mashup) => {
      const bpm = mashup.bpm || 0;
      return bpm >= bpmRange[0] && bpm <= bpmRange[1];
    });

    // Sorting
    switch (sortBy) {
      case 'oldest':
        filtered = [...filtered].sort((a, b) =>
          new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        );
        break;
      case 'title-asc':
        filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        filtered = [...filtered].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'author-asc':
        filtered = [...filtered].sort((a, b) => (a.user?.name || '').localeCompare(b.user?.name || ''));
        break;
      case 'author-desc':
        filtered = [...filtered].sort((a, b) => (b.user?.name || '').localeCompare(a.user?.name || ''));
        break;
      case 'bpm-asc':
        filtered = [...filtered].sort((a, b) => (a.bpm || 0) - (b.bpm || 0));
        break;
      case 'bpm-desc':
        filtered = [...filtered].sort((a, b) => (b.bpm || 0) - (a.bpm || 0));
        break;
      case 'recent':
      default:
        filtered = [...filtered].sort((a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        break;
    }

    setFilteredMashups(filtered);
    setCurrentPage(1);
  }, [mashups, searchQuery, bpmRange, sortBy]);

  const totalPages = Math.ceil(filteredMashups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMashups = filteredMashups.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setBpmRange([0, 200]);
    setSortBy('recent');
  };

  const hasActiveFilters = searchQuery || bpmRange[0] > 0 || bpmRange[1] < 200 || sortBy !== 'recent';

  return (
    <AppLayout breadcrumbs={[{ title: 'Explorar', href: '/explore' }]}>
      <Head title="Explorar Beats" />

      <div className="p-4 lg:p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-blue-600/20 border border-pink-500/20 p-6 lg:p-8 mb-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span className="text-sm font-medium text-pink-400 uppercase tracking-wider">Biblioteca de Mashups</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                Descubre música increíble
              </span>
            </h1>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl">
              Explora nuestra colección de mashups creados por productores talentosos.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/mashups/create">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg shadow-pink-500/25">
                  <Plus className="w-4 h-4 mr-2" />
                  Subir Mashup
                </Button>
              </Link>
              <Link href="/mashups/batch">
                <Button variant="outline" className="border-pink-500/50 hover:bg-pink-500/10">
                  <Music className="w-4 h-4 mr-2" />
                  Subida Múltiple
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar mashups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Toggle Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${showFilters ? 'bg-pink-600 text-white' : 'bg-gray-900 text-gray-300 border border-gray-700 hover:border-pink-500'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {hasActiveFilters && <span className="w-2 h-2 bg-pink-400 rounded-full"></span>}
            </button>

            {/* Results */}
            <span className="text-sm text-gray-400">
              {filteredMashups.length} resultados
            </span>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-pink-400 hover:text-pink-300">
                Limpiar
              </button>
            )}

            {/* View Toggle */}
            <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BPM Range Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Rango BPM: <span className="text-pink-400">{bpmRange[0]} - {bpmRange[1]}</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 w-8">Min</span>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={bpmRange[0]}
                        onChange={(e) => setBpmRange([Math.min(Number(e.target.value), bpmRange[1] - 10), bpmRange[1]])}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                      <input
                        type="number"
                        value={bpmRange[0]}
                        onChange={(e) => setBpmRange([Math.min(Number(e.target.value), bpmRange[1] - 10), bpmRange[1]])}
                        className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white text-center"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 w-8">Max</span>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={bpmRange[1]}
                        onChange={(e) => setBpmRange([bpmRange[0], Math.max(Number(e.target.value), bpmRange[0] + 10)])}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                      <input
                        type="number"
                        value={bpmRange[1]}
                        onChange={(e) => setBpmRange([bpmRange[0], Math.max(Number(e.target.value), bpmRange[0] + 10)])}
                        className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white text-center"
                      />
                    </div>
                  </div>
                  {/* Quick BPM Presets */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { label: 'Todo', range: [0, 200] },
                      { label: 'Lento', range: [0, 90] },
                      { label: 'Medio', range: [90, 120] },
                      { label: 'Rápido', range: [120, 150] },
                      { label: 'Muy Rápido', range: [150, 200] },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setBpmRange(preset.range as [number, number])}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${bpmRange[0] === preset.range[0] && bpmRange[1] === preset.range[1]
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Ordenar por
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${sortBy === opt.value
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin mx-auto"></div>
                <Music className="w-6 h-6 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-gray-400 mt-6 text-lg">Cargando beats increíbles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-red-500/50">
              Reintentar
            </Button>
          </div>
        ) : filteredMashups.length === 0 ? (
          <div className="text-center py-24 bg-gray-900/50 rounded-2xl border border-gray-700/50">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No se encontraron mashups</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {hasActiveFilters ? 'Intenta ajustar los filtros' : '¡Sé el primero en crear un mashup!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Limpiar Filtros
                </Button>
              )}
              <Link href="/mashups/create">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-500/25">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Mashup
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <MashupList mashups={currentMashups} viewMode={viewMode} />

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                  <Pagination>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700'}
                    >
                      Anterior
                    </PaginationPrevious>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                            className={`cursor-pointer ${currentPage === pageNum ? 'bg-pink-600' : ''}`}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-700'}
                    >
                      Siguiente
                    </PaginationNext>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}