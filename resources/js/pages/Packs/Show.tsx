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

            <div className="relative">
                {/* Hero Section */}
                <div className="h-[300px] w-full relative overflow-hidden">
                    {pack.cover_image_path ? (
                        <img src={pack.cover_image_path} className="w-full h-full object-cover blur-sm opacity-50 absolute inset-0" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800 absolute inset-0" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-end">
                        <div className="w-48 h-48 rounded-xl overflow-hidden border-4 border-gray-800 shadow-2xl flex-shrink-0 bg-gray-800 relative z-10 -mb-12 md:mb-0">
                            {pack.cover_image_path ? (
                                <img src={pack.cover_image_path} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <Music className="w-20 h-20 text-gray-500" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 mb-4 md:mb-0 relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 shadow-sm">{pack.title}</h1>
                            <div className="flex items-center gap-4 text-gray-300 mb-4">
                                <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <User className="w-4 h-4" /> {pack.user.name}
                                </span>
                                <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <Clock className="w-4 h-4" /> {new Date(pack.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300 max-w-2xl text-lg">{pack.description}</p>
                        </div>

                        <div className="flex flex-col gap-3 mb-4 md:mb-0 min-w-[200px] relative z-10">
                            {hasPurchased ? (
                                <div className="bg-green-600/20 border border-green-500/50 text-green-400 px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold backdrop-blur-md">
                                    <CheckCircle className="w-5 h-5" />
                                    Pack Adquirido
                                </div>
                            ) : (
                                <Button
                                    onClick={handleBuy}
                                    disabled={buying || !auth.user}
                                    className="w-full py-6 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-0 shadow-xl shadow-pink-500/20"
                                >
                                    {buying ? 'Procesando...' : (
                                        <>
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                            Comprar por {pack.price}
                                            <Coins className="w-4 h-4 ml-1 text-yellow-300" />
                                        </>
                                    )}
                                </Button>
                            )}
                            {!auth.user && (
                                <p className="text-xs text-center text-gray-400">Inicia sesión para comprar</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-6 py-12 pt-16">
                    {pack.mashups && pack.mashups.length > 0 && (
                        <>
                            <div className="mb-6 flex items-center gap-2">
                                <Music className="w-5 h-5 text-pink-500" />
                                <h2 className="text-2xl font-bold text-white">Contenido del Pack ({pack.mashups.length} Mashups)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pack.mashups.map((mashup, index) => (
                                    <BeatCard
                                        key={mashup.id}
                                        id={mashup.id}
                                        title={mashup.title}
                                        user={mashup.user.name}
                                        bpm={mashup.bpm}
                                        tonalidad={mashup.key}
                                        image={mashup.image_path}
                                        audio={mashup.file_path} // Adjust according to how file_path is stored (might need /storage prefix if not handled by accessor)
                                        index={index}
                                        viewMode="list" // Use list view for pack contents
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {(!pack.mashups || pack.mashups.length === 0) && (
                        <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                            <Music className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300">Contenido del Pack</h3>
                            <p className="text-gray-500 mt-2">Este pack contiene múltiples archivos de audio.</p>
                            {hasPurchased && (
                                <div className="mt-6">
                                    <Button onClick={() => window.open(route('packs.download', pack.id), '_blank')} className="bg-green-600 hover:bg-green-700">
                                        <Clock className="w-4 h-4 mr-2" />
                                        Descargar Archivos (.zip)
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
