import { useState } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react'; // Add Link import for pagination
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Check, X, Music, User, Clock, BarChart3, Users, Coins, FileCheck, FileX, FileClock, Trash2, Undo2, Pencil, Search, Ban, Package, Play, Pause, Volume2, SkipBack, SkipForward, Maximize2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useAudioPlayer } from '@/contexts/audio-player-context';

interface Pack {
    id: number;
    title: string;
    price: number;
    user: {
        name: string;
    };
    mashups_count: number;
    created_at: string;
    deleted_at: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    credits: number;
    mashups_count?: number;
    created_at: string;
    deleted_at: string | null;
}

interface Mashup {
    id: number;
    title: string;
    description?: string;
    bpm?: number;
    key?: string;
    user: {
        name: string;
        email: string;
    };
    created_at: string;
    status: string;
    deleted_at: string | null;
    audio_url?: string; // Audio url for playback
}

interface PaginatedResponse<T> {
    data: T[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Stats {
    total_mashups: number;
    approved_mashups: number;
    pending_mashups: number;
    rejected_mashups: number;
    total_users: number;
    total_packs: number;
    total_credits_distributed: number;
}

interface Props {
    pendingMashups: Mashup[];
    allMashups: PaginatedResponse<Mashup>;
    allPacks: PaginatedResponse<Pack>;
    allUsers: PaginatedResponse<User>;
    stats: Stats;
}

export default function AdminDashboard({ pendingMashups = [], allMashups, allPacks, allUsers, stats }: Props) {
    const [loading, setLoading] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'users' | 'mashups' | 'packs'>('pending');

    const { currentTrack, isPlaying, play, pause, toggle } = useAudioPlayer();
    const { flash } = usePage().props as any;

    const handlePlayPause = (mashup: Mashup) => {
        if (!mashup.audio_url) {
            console.warn('Audio URL missing for mashup:', mashup);
            return;
        }

        toggle({
            id: mashup.id,
            url: mashup.audio_url,
            title: mashup.title,
            artist: mashup.user.name
        });
    };

    const handleApprove = (id: number) => {
        setLoading(id);
        router.put(`/admin/mashups/${id}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => setLoading(null),
            onError: () => setLoading(null),
        });
    };

    const handleReject = (id: number) => {
        setLoading(id);
        router.put(`/admin/mashups/${id}/reject`, {}, {
            preserveScroll: true,
            onSuccess: () => setLoading(null),
            onError: () => setLoading(null),
        });
    };

    const handleDeleteMashup = (id: number) => {
        if (!confirm('¿Estás seguro de querer eliminar este mashup?')) return;
        router.delete(`/admin/mashups/${id}`, { preserveScroll: true });
    };

    const handleRestoreMashup = (id: number) => {
        router.post(`/admin/mashups/${id}/restore`, {}, { preserveScroll: true });
    };

    const handleDeleteUser = (id: number) => {
        if (!confirm('¿Estás seguro de enviar este usuario a la papelera?')) return;
        router.delete(`/admin/users/${id}`, { preserveScroll: true });
    };

    const handleRestoreUser = (id: number) => {
        router.post(`/admin/users/${id}/restore`, {}, { preserveScroll: true });
    };

    const handleDeletePack = (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este pack?')) return;
        router.delete(`/admin/packs/${id}`, { preserveScroll: true });
    };

    const handleRestorePack = (id: number) => {
        router.post(`/admin/packs/${id}/restore`, {}, { preserveScroll: true });
    };

    const statCards = [
        { label: 'Total Mashups', value: stats.total_mashups, icon: Music, gradient: 'from-pink-600 to-purple-600' },
        { label: 'Aprobados', value: stats.approved_mashups, icon: FileCheck, gradient: 'from-green-600 to-emerald-600' },
        { label: 'Pendientes', value: stats.pending_mashups, icon: FileClock, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Rechazados', value: stats.rejected_mashups, icon: FileX, gradient: 'from-red-600 to-rose-600' },
        { label: 'Usuarios', value: stats.total_users, icon: Users, gradient: 'from-blue-600 to-cyan-600' },
        { label: 'Packs', value: stats.total_packs, icon: Package, gradient: 'from-indigo-600 to-violet-600' },
        { label: 'Créditos Totales', value: stats.total_credits_distributed, icon: Coins, gradient: 'from-yellow-500 to-amber-500' },
    ];

    const Pagination = ({ links }: { links: any[] }) => {
        if (links.length <= 3) return null;
        return (
            <div className="flex justify-center gap-1 mt-6 overflow-x-auto pb-2">
                {links.map((link, i) => (
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            only={activeTab === 'users' ? ['allUsers'] : activeTab === 'packs' ? ['allPacks'] : ['allMashups']}
                            preserveState
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${link.active
                                ? 'bg-pink-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={i}
                            className="px-3 py-1 text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="p-6 max-w-7xl mx-auto pb-32"> {/* Added padding bottom for player */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Panel de Administración
                    </h1>
                    <p className="text-gray-400 mt-2">Gestiona usuarios, mashups, y revisiones pendientes.</p>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-3 text-green-400 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        {flash.success}
                    </div>
                )}

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Tabs */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden min-h-[500px]">
                    <div className="border-b border-gray-800 bg-gray-900/50 px-6 py-4 flex gap-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'pending' ? 'text-pink-500 border-pink-500' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2">
                                <FileClock className="w-4 h-4" />
                                Pendientes ({stats.pending_mashups})
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('mashups')}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'mashups' ? 'text-purple-500 border-purple-500' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                Gestión de Mashups
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'users' ? 'text-blue-500 border-blue-500' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Gestión de Usuarios
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('packs')}
                            className={`pb-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'packs' ? 'text-indigo-500 border-indigo-500' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Gestión de Packs
                            </span>
                        </button>
                    </div>

                    <div className="p-6">
                        {/* PENDING MASHUPS TAB */}
                        {activeTab === 'pending' && (
                            <div className="space-y-4">
                                {pendingMashups.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check className="h-8 w-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-300 mb-2">¡Todo al día!</h3>
                                        <p className="text-gray-400">No hay mashups pendientes de revisión.</p>
                                    </div>
                                ) : (
                                    pendingMashups.map((mashup) => (
                                        <div key={mashup.id} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handlePlayPause(mashup)}
                                                        disabled={!mashup.audio_url}
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${!mashup.audio_url ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-pink-500/20 text-pink-500 hover:bg-pink-500 hover:text-white'}`}
                                                    >
                                                        {currentTrack?.id === mashup.id && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                                    </button>
                                                    <h3 className="font-semibold text-white text-lg">{mashup.title}</h3>
                                                </div>
                                                <div className="flex gap-4 text-sm text-gray-400 mt-1">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {mashup.user.name}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(mashup.created_at).toLocaleDateString()}</span>
                                                    {mashup.bpm && <span>{mashup.bpm} BPM</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <Button onClick={() => handleApprove(mashup.id)} disabled={loading === mashup.id} className="flex-1 bg-green-600 hover:bg-green-700">Aprobar</Button>
                                                <Button onClick={() => handleReject(mashup.id)} disabled={loading === mashup.id} variant="destructive" className="flex-1">Rechazar</Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* MASHUPS MANAGEMENT TAB */}
                        {activeTab === 'mashups' && (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Título</th>
                                                <th className="px-4 py-3">Usuario</th>
                                                <th className="px-4 py-3">Estado</th>
                                                <th className="px-4 py-3">Fecha</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {allMashups.data.map((mashup) => (
                                                <tr key={mashup.id} className={`hover:bg-gray-800/30 ${mashup.deleted_at ? 'opacity-50 grayscale' : ''}`}>
                                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{mashup.id}</td>
                                                    <td className="px-4 py-3 font-medium text-white">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handlePlayPause(mashup)}
                                                                disabled={!mashup.audio_url}
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${!mashup.audio_url ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-700 hover:bg-pink-600 text-white'}`}
                                                            >
                                                                {currentTrack?.id === mashup.id && isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                                                            </button>
                                                            <span>{mashup.title}</span>
                                                        </div>
                                                        {mashup.deleted_at && <span className="ml-2 px-1.5 py-0.5 bg-red-900/50 text-red-400 text-[10px] rounded">ELIMINADO</span>}
                                                    </td>
                                                    <td className="px-4 py-3">{mashup.user.name}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded textxs ${mashup.status === 'approved' ? 'bg-green-900/30 text-green-400' :
                                                            mashup.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                                                                'bg-amber-900/30 text-amber-400'
                                                            }`}>
                                                            {mashup.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{new Date(mashup.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        {mashup.deleted_at ? (
                                                            <button onClick={() => handleRestoreMashup(mashup.id)} className="text-blue-400 hover:text-blue-300 p-1" title="Restaurar"><Undo2 className="w-4 h-4" /></button>
                                                        ) : (
                                                            <button onClick={() => handleDeleteMashup(mashup.id)} className="text-red-400 hover:text-red-300 p-1" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={allMashups.links} />
                            </div>
                        )}

                        {/* USERS MANAGEMENT TAB */}
                        {activeTab === 'users' && (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Usuario</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Rol</th>
                                                <th className="px-4 py-3">Créditos</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {allUsers.data.map((user) => (
                                                <tr key={user.id} className={`hover:bg-gray-800/30 ${user.deleted_at ? 'opacity-50 grayscale' : ''}`}>
                                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{user.id}</td>
                                                    <td className="px-4 py-3 flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-white">{user.name}</span>
                                                        {user.deleted_at && <span className="px-1.5 py-0.5 bg-red-900/50 text-red-400 text-[10px] rounded">ELIMINADO</span>}
                                                    </td>
                                                    <td className="px-4 py-3">{user.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 flex items-center gap-1">
                                                        <Coins className="w-3 h-3 text-yellow-500" />
                                                        {user.credits}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {user.deleted_at ? (
                                                            <button onClick={() => handleRestoreUser(user.id)} className="text-blue-400 hover:text-blue-300 p-1" title="Restaurar"><Undo2 className="w-4 h-4" /></button>
                                                        ) : (
                                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 p-1" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={allUsers.links} />
                            </div>
                        )}

                        {/* PACKS MANAGEMENT TAB */}
                        {activeTab === 'packs' && (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-gray-400">
                                        <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
                                            <tr>
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Título</th>
                                                <th className="px-4 py-3">Usuario</th>
                                                <th className="px-4 py-3">Precio</th>
                                                <th className="px-4 py-3">Contenido</th>
                                                <th className="px-4 py-3">Fecha</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {allPacks.data.map((pack) => (
                                                <tr key={pack.id} className={`hover:bg-gray-800/30 ${pack.deleted_at ? 'opacity-50 grayscale' : ''}`}>
                                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">#{pack.id}</td>
                                                    <td className="px-4 py-3 font-medium text-white">
                                                        {pack.title}
                                                        {pack.deleted_at && <span className="ml-2 px-1.5 py-0.5 bg-red-900/50 text-red-400 text-[10px] rounded">ELIMINADO</span>}
                                                    </td>
                                                    <td className="px-4 py-3">{pack.user.name}</td>
                                                    <td className="px-4 py-3">{pack.price} Créditos</td>
                                                    <td className="px-4 py-3">{pack.mashups_count} Mashups</td>
                                                    <td className="px-4 py-3">{new Date(pack.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        {pack.deleted_at ? (
                                                            <button onClick={() => handleRestorePack(pack.id)} className="text-blue-400 hover:text-blue-300 p-1" title="Restaurar"><Undo2 className="w-4 h-4" /></button>
                                                        ) : (
                                                            <button onClick={() => handleDeletePack(pack.id)} className="text-red-400 hover:text-red-300 p-1" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={allPacks.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Dashboard', href: '/admin' }]}>
        {page}
    </AppLayout>
);
