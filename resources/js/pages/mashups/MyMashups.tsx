import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Lock, Globe, ArrowLeft, Plus, Loader, Music } from 'lucide-react';

interface Mashup {
  id: number;
  title: string;
  description: string;
  bpm?: number;
  key?: string;
  image?: string;
  audio?: string;
  user?: {
    name: string;
  };
  is_public: boolean;
  is_approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function MyMashups() {
  const [mashups, setMashups] = useState<Mashup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    // Cargar mashups del usuario
    fetch('/api/user/mashups')
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
        setError('No se pudieron cargar tus mashups');
        setMashups([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este mashup? Esta acción no se puede deshacer.')) {
      setDeletingId(id);
      router.delete(`/mashups/${id}`, {
        onSuccess: () => {
          setMashups((prev) => prev.filter((m) => m.id !== id));
          setDeletingId(null);
        },
        onError: () => {
          setDeletingId(null);
          alert('Error al eliminar el mashup');
        },
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendiente de Aprobación' },
      approved: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Aprobado' },
      rejected: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Rechazado' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Head title="Mis Mashups" />

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
          <Link href="/explore" className="flex items-center space-x-2 text-pink-500 hover:text-pink-400 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Explorar</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Mis Mashups</h1>
              <p className="text-gray-400">Gestiona todos tus mashups y contenido</p>
            </div>
            <Link href="/mashups/create">
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nuevo Mashup</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-gray-700 border-t-pink-500 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Cargando tus mashups...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Reintentar
            </Button>
          </div>
        ) : mashups.length === 0 ? (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No tienes mashups aún</h3>
            <p className="text-gray-400 mb-6">Crea tu primer mashup y comparte tu creatividad con la comunidad</p>
            <Link href="/mashups/create">
              <Button className="bg-pink-600 hover:bg-pink-700 flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Crear Mashup</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total de Mashups</p>
                <p className="text-3xl font-bold text-pink-500">{mashups.length}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Aprobados</p>
                <p className="text-3xl font-bold text-green-500">{mashups.filter((m) => m.is_approved).length}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-500">{mashups.filter((m) => m.status === 'pending').length}</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Públicos</p>
                <p className="text-3xl font-bold text-blue-500">{mashups.filter((m) => m.is_public).length}</p>
              </div>
            </div>

            {/* Lista de Mashups */}
            <div className="space-y-4">
              {mashups.map((mashup) => (
                <div
                  key={mashup.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Imagen y Info */}
                    <div className="flex gap-4 flex-1">
                      <img
                        src={mashup.image || '/default-image.jpg'}
                        alt={mashup.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{mashup.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{mashup.description}</p>
                        <div className="flex flex-wrap gap-3 items-center">
                          {mashup.bpm && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {mashup.bpm} BPM
                            </span>
                          )}
                          {mashup.key && (
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                              {mashup.key}
                            </span>
                          )}
                          {getStatusBadge(mashup.status)}
                          {mashup.is_public ? (
                            <span className="text-xs flex items-center space-x-1 text-blue-400">
                              <Globe className="w-3 h-3" />
                              <span>Público</span>
                            </span>
                          ) : (
                            <span className="text-xs flex items-center space-x-1 text-gray-400">
                              <Lock className="w-3 h-3" />
                              <span>Privado</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 md:flex-col md:items-end">
                      <Link href={`/mashups/${mashup.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Editar</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(mashup.id)}
                        disabled={deletingId === mashup.id}
                        className="flex items-center space-x-1 text-red-400 hover:text-red-300 border-red-500/50 hover:border-red-500"
                      >
                        {deletingId === mashup.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}