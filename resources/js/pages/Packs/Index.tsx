import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, ShoppingCart, User, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Pack {
    id: number;
    title: string;
    description: string;
    cover_image_path: string | null;
    price: number;
    user: {
        name: string;
    };
    mashups_count?: number;
    mashups?: {
        id: number;
        image_path: string;
    }[];
}

export default function PacksIndex({ packs }: { packs: Pack[] }) {
    const { auth } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Explorar Packs', href: '/packs' }]}>
            <Head title="Explorar Packs" />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Packs de Mashups
                        </h1>
                        <p className="text-gray-400 mt-2">Colecciones curadas de los mejores mashups.</p>
                    </div>

                    {auth.user && (
                        <Link href={route('packs.create')}>
                            <Button className="bg-pink-600 hover:bg-pink-700">
                                <Package className="w-4 h-4 mr-2" />
                                Crear Pack
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packs.length > 0 ? (
                        packs.map((pack) => (
                            <Link key={pack.id} href={route('packs.show', pack.id)} className="block group">
                                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10">
                                    <div className="relative aspect-[16/9] bg-gray-800 overflow-hidden">
                                        {pack.cover_image_path ? (
                                            <img src={pack.cover_image_path} alt={pack.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            // Fallback collage if no cover
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                                                <Music className="w-16 h-16 text-gray-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />

                                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                                                <p className="text-xs font-semibold text-white flex items-center gap-1">
                                                    <User className="w-3 h-3" /> {pack.user.name}
                                                </p>
                                            </div>
                                            <div className="bg-purple-600 px-2 py-1 rounded-md shadow-lg">
                                                <p className="text-xs font-bold text-white flex items-center gap-1">
                                                    {pack.price} Créditos
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors mb-2">
                                            {pack.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                            {pack.description || "Sin descripción"}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
                                            <span className="flex items-center gap-1.5">
                                                <Music className="w-3.5 h-3.5" />
                                                Pack de Música
                                            </span>
                                            <span className="flex items-center gap-1 text-pink-500 font-medium">
                                                Ver Detalles &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-gray-900/50 rounded-xl border border-gray-800">
                            <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300">No hay packs disponibles</h3>
                            <p className="text-gray-500 mt-2">¡Sé el primero en crear uno!</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
