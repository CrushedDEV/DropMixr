import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Music, Coins, Upload, Download, CheckCircle, Clock, ShoppingCart, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

interface UploadedMashup {
    id: number;
    title: string;
    description?: string;
    bpm?: number;
    key?: string;
    image: string;
    audio: string;
    status: string;
    is_approved: boolean;
    created_at: string;
    downloads_count: number;
}

interface PurchasedMashup {
    id: number;
    title: string;
    bpm?: number;
    key?: string;
    image: string;
    audio: string;
    user: string;
    credits_spent: number;
    purchased_at: string;
}

interface Stats {
    credits: number;
    total_uploads: number;
    approved_uploads: number;
    pending_uploads: number;
    total_purchases: number;
    credits_spent: number;
    credits_earned: number;
}

interface Props {
    uploadedMashups: UploadedMashup[];
    purchasedMashups: PurchasedMashup[];
    stats: Stats;
}

export default function Dashboard({ uploadedMashups, purchasedMashups, stats }: Props) {
    const [activeTab, setActiveTab] = useState<'uploads' | 'purchases'>('uploads');
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (id: number, audioUrl: string) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            audioRef.current = new Audio(audioUrl);
            audioRef.current.play();
            audioRef.current.onended = () => setPlayingId(null);
            setPlayingId(id);
        }
    };

    const statCards = [
        { label: 'Créditos', value: stats.credits, icon: Coins, gradient: 'from-yellow-500 to-amber-500' },
        { label: 'Subidos', value: stats.total_uploads, icon: Upload, gradient: 'from-pink-600 to-purple-600' },
        { label: 'Aprobados', value: stats.approved_uploads, icon: CheckCircle, gradient: 'from-green-600 to-emerald-600' },
        { label: 'Pendientes', value: stats.pending_uploads, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Comprados', value: stats.total_purchases, icon: ShoppingCart, gradient: 'from-blue-600 to-cyan-600' },
        { label: 'Gastados', value: stats.credits_spent, icon: Coins, gradient: 'from-red-500 to-rose-500' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Aprobado</span>;
            case 'pending':
                return <span className="px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">Pendiente</span>;
            case 'rejected':
                return <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">Rechazado</span>;
            default:
                return null;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Mi Dashboard" />

            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Mi Dashboard
                    </h1>
                    <p className="text-gray-400 mt-2">Gestiona tus mashups y revisa tu actividad</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-3`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 mb-8">
                    <Link href="/mashups/create">
                        <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                            <Upload className="w-4 h-4 mr-2" />
                            Subir Mashup
                        </Button>
                    </Link>
                    <Link href="/mashups/batch">
                        <Button variant="outline">
                            <Music className="w-4 h-4 mr-2" />
                            Subida Múltiple
                        </Button>
                    </Link>
                    <Link href="/explore">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Explorar
                        </Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('uploads')}
                        className={`pb-3 px-4 ${activeTab === 'uploads'
                            ? 'border-b-2 border-pink-500 text-pink-500'
                            : 'text-gray-400 hover:text-white'}`}
                    >
                        <Upload className="w-4 h-4 inline mr-2" />
                        Mis Mashups ({uploadedMashups.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('purchases')}
                        className={`pb-3 px-4 ${activeTab === 'purchases'
                            ? 'border-b-2 border-pink-500 text-pink-500'
                            : 'text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingCart className="w-4 h-4 inline mr-2" />
                        Comprados ({purchasedMashups.length})
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'uploads' && (
                    <div className="grid gap-4">
                        {uploadedMashups.length === 0 ? (
                            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
                                <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">No has subido ningún mashup</h3>
                                <p className="text-gray-400 mb-4">¡Empieza a compartir tu música con la comunidad!</p>
                                <Link href="/mashups/create">
                                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Subir mi primer mashup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            uploadedMashups.map((mashup) => (
                                <div
                                    key={mashup.id}
                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-pink-500/50 transition-colors flex items-center gap-4"
                                >
                                    <img
                                        src={mashup.image}
                                        alt={mashup.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />

                                    <button
                                        onClick={() => handlePlay(mashup.id, mashup.audio)}
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center flex-shrink-0"
                                    >
                                        {playingId === mashup.id ? (
                                            <Pause className="w-4 h-4 text-white" />
                                        ) : (
                                            <Play className="w-4 h-4 text-white ml-0.5" />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate">{mashup.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            {mashup.bpm && <span>{mashup.bpm} BPM</span>}
                                            {mashup.key && <span>{mashup.key}</span>}
                                            <span>{mashup.downloads_count} descargas</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(mashup.status)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'purchases' && (
                    <div className="grid gap-4">
                        {purchasedMashups.length === 0 ? (
                            <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
                                <ShoppingCart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">No has comprado ningún mashup</h3>
                                <p className="text-gray-400 mb-4">Explora la biblioteca y descarga mashups increíbles</p>
                                <Link href="/explore">
                                    <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                                        <Download className="w-4 h-4 mr-2" />
                                        Explorar mashups
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            purchasedMashups.map((mashup) => (
                                <div
                                    key={mashup.id}
                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:border-pink-500/50 transition-colors flex items-center gap-4"
                                >
                                    <img
                                        src={mashup.image}
                                        alt={mashup.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />

                                    <button
                                        onClick={() => handlePlay(mashup.id, mashup.audio)}
                                        className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center flex-shrink-0"
                                    >
                                        {playingId === mashup.id ? (
                                            <Pause className="w-4 h-4 text-white" />
                                        ) : (
                                            <Play className="w-4 h-4 text-white ml-0.5" />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white truncate">{mashup.title}</h3>
                                        <div className="flex items-center gap-3 text-sm text-gray-400">
                                            <span>Por {mashup.user}</span>
                                            {mashup.bpm && <span>{mashup.bpm} BPM</span>}
                                            {mashup.key && <span>{mashup.key}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-amber-400">
                                            <Coins className="w-4 h-4" />
                                            {mashup.credits_spent}
                                        </span>
                                        <Link href={`/mashups/${mashup.id}/download`}>
                                            <Button size="sm" variant="outline">
                                                <Download className="w-4 h-4 mr-1" />
                                                Descargar
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
