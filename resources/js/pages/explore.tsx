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

      <div className="min-h-screen bg-black">
        {/* Header / Hero - Minimal */}
        <div className="pt-8 pb-6 px-4 lg:px-8 border-b border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                  Explorar<span className="text-pink-600">.</span>
                </h1>
                <p className="text-zinc-400 text-lg max-w-xl font-light">
                  Navega por nuestra colección curada de mashups y edits exclusivos.
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/mashups/create">
                  <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-medium px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Subir
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

              {/* Search */}
              <div className="relative w-full md:max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar mashups, artistas..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 focus:bg-zinc-900/80 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                {/* Sort */}
                <div className="relative min-w-[140px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-full pl-4 pr-10 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${showFilters || hasActiveFilters ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtros</span>
                  {hasActiveFilters && <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
                </button>

                {/* View Mode */}
                <div className="flex items-center bg-zinc-900 rounded-full border border-zinc-800 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-white/5 animate-in slide-in-from-top-2">
                <div className="flex flex-col sm:flex-row gap-8">
                  {/* BPM Input */}
                  <div className="w-full sm:max-w-xs space-y-3">
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>Rango BPM</span>
                      <span className="text-white font-mono">{bpmRange[0]} - {bpmRange[1]}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-600 font-mono w-8">MIN</span>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={bpmRange[0]}
                        onChange={(e) => setBpmRange([Math.min(Number(e.target.value), bpmRange[1] - 10), bpmRange[1]])}
                        className="flex-1 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-600 font-mono w-8">MAX</span>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={bpmRange[1]}
                        onChange={(e) => setBpmRange([bpmRange[0], Math.max(Number(e.target.value), bpmRange[0] + 10)])}
                        className="flex-1 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="flex-1 space-y-3">
                    <span className="text-sm text-zinc-400">Presets Rápidos</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Todo', range: [0, 200] },
                        { label: 'Lento <90', range: [0, 90] },
                        { label: 'Medio 90-120', range: [90, 120] },
                        { label: 'House 120-130', range: [120, 130] },
                        { label: 'Rápido >130', range: [130, 200] },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setBpmRange(preset.range as [number, number])}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${bpmRange[0] === preset.range[0] && bpmRange[1] === preset.range[1]
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
                            }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-50">
              <Loader className="w-8 h-8 animate-spin text-zinc-600 mb-4" />
              <p className="text-sm text-zinc-600">Cargando...</p>
            </div>
          ) : filteredMashups.length > 0 ? (
            <>
              <MashupList mashups={currentMashups} viewMode={viewMode} />

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2">
                    <Pagination>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer'}
                      />
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
                              className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer'}
                      />
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-zinc-800">
                <Search className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No encontramos resultados</h3>
              <p className="text-zinc-500 max-w-sm mx-auto mb-6">Intentá ajustar tu búsqueda o los filtros para encontrar lo que buscás.</p>
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-pink-500 hover:text-pink-400 transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}