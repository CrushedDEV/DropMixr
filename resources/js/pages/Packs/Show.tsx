import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, User, Music, Coins, ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import BeatCard from '@/components/BeatCard';

interface Pack {
    id: number;
    title: string;
    description: string;
    cover_image_path: string | null;
    price: number;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    mashups: any[];
}

export default function PacksShow({ pack, hasPurchased }: { pack: Pack, hasPurchased: boolean }) {
    const { auth, flash } = usePage().props as any;
    const [buying, setBuying] = useState(false);



    const handleBuy = () => {
        if (!confirm(`¿Comprar este pack por ${pack.price} créditos?`)) return;
        setBuying(true);
        router.post(route('packs.buy', pack.id), {}, {
            onFinish: () => setBuying(false)
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Packs', href: '/packs' }, { title: pack.title, href: '#' }]}>
            <Head title={pack.title} />

            <div className="min-h-screen bg-black">
                {/* Immersive Hero */}
                <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
                    {/* Background Image / Blur */}
                    {pack.cover_image_path ? (
                        <>
                            <img src={pack.cover_image_path} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 backdrop-blur-3xl bg-black/40" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end z-20">
                        {/* Cover Art Card */}
                        <div className="w-52 h-52 md:w-64 md:h-64 rounded-xl overflow-hidden shadow-2xl bg-zinc-800 flex-shrink-0 border border-white/10 -mb-16 md:mb-0 relative z-30">
                            {pack.cover_image_path ? (
                                <img src={pack.cover_image_path} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                    <Music className="w-20 h-20" />
                                </div>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="flex-1 space-y-4 mb-4 md:mb-2">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-2">{pack.title}</h1>

                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <User className="w-4 h-4" />
                                        <span>{pack.user.name}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/30" />
                                    <div className="text-white/60">
                                        {new Date(pack.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/30" />
                                    <div className="text-white/60">
                                        {pack.mashups ? pack.mashups.length : 0} tracks
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed font-light">
                                {pack.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 min-w-[240px]">
                            {hasPurchased ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20 font-medium justify-center">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Pack Adquirido</span>
                                    </div>
                                    <Button
                                        onClick={() => window.open(route('packs.download', pack.id), '_blank')}
                                        className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-base font-semibold rounded-xl"
                                    >
                                        <Clock className="w-4 h-4 mr-2" />
                                        Descargar .ZIP
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600">
                                    <Button
                                        onClick={handleBuy}
                                        disabled={buying || !auth.user}
                                        className="w-full h-auto py-4 bg-black hover:bg-zinc-900 text-white border-0 rounded-xl flex flex-col items-center gap-1"
                                    >
                                        {buying ? (
                                            <span className="text-zinc-400">Procesando...</span>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-1.5 text-lg font-bold">
                                                    <span>Comprar</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm font-medium text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">
                                                    <span>{pack.price}</span>
                                                    <Coins className="w-3.5 h-3.5" />
                                                </div>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                            {!auth.user && !hasPurchased && (
                                <p className="text-xs text-center text-zinc-500 font-medium">Inicia sesión para comprar</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content List */}
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-20">
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl font-bold text-white">Contenido del Pack</h2>
                        <span className="text-zinc-500 text-sm font-mono">{pack.mashups?.length || 0} ITEMS</span>
                    </div>

                    {pack.mashups && pack.mashups.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {pack.mashups.map((mashup, index) => (
                                <BeatCard
                                    key={mashup.id}
                                    id={mashup.id}
                                    title={mashup.title}
                                    user={mashup.user.name}
                                    bpm={mashup.bpm}
                                    tonalidad={mashup.key}
                                    image={mashup.image_path}
                                    audio={mashup.file_path}
                                    index={index}
                                    viewMode="list"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center border border-dashed border-zinc-800 rounded-2xl">
                            <Music className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">No hay contenido visible en este pack.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
