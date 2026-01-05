import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Package, ShoppingCart, User, Music, Coins } from 'lucide-react';
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
        title: string;
        image_path?: string;
    }[];
}

export default function PacksIndex({ packs }: { packs: Pack[] }) {
    const { auth } = usePage().props as any;

    return (
        <AppLayout breadcrumbs={[{ title: 'Explorar Packs', href: '/packs' }]}>
            <Head title="Explorar Packs" />

            <div className="min-h-screen bg-black">
                {/* Header / Hero */}
                <div className="pt-12 pb-8 px-4 lg:px-8 border-b border-white/5">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-2">
                                Packs<span className="text-pink-600">.</span>
                            </h1>
                            <p className="text-zinc-400 text-lg max-w-xl font-light">
                                Colecciones curadas y exclusivas para DJs y productores.
                            </p>
                        </div>

                        {auth.user && (
                            <Link href={route('packs.create')}>
                                <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-medium px-6">
                                    <Package className="w-4 h-4 mr-2" />
                                    Crear Pack
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {packs.length > 0 ? (
                            packs.map((pack) => (
                                <Link key={pack.id} href={route('packs.show', pack.id)} className="group block">
                                    {/* Cover Image */}
                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 mb-4 shadow-lg">
                                        {pack.cover_image_path ? (
                                            <img
                                                src={pack.cover_image_path}
                                                alt={pack.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-600">
                                                <Music className="w-16 h-16 opacity-50" />
                                            </div>
                                        )}

                                        {/* Overlay Info (Price) */}
                                        <div className="absolute top-3 right-3">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold">
                                                <span>{pack.price}</span>
                                                <Coins className="w-3 h-3 text-yellow-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text Info */}
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-pink-500 transition-colors">
                                                {pack.title}
                                            </h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm text-zinc-400 font-medium">
                                                    {pack.user.name}
                                                </p>
                                                {pack.mashups_count !== undefined && (
                                                    <span className="text-xs text-zinc-600">
                                                        {pack.mashups_count} tracks
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mini Track List */}
                                        {pack.mashups && pack.mashups.length > 0 && (
                                            <div className="space-y-1 pt-2 border-t border-white/5">
                                                {pack.mashups.slice(0, 3).map((mashup) => (
                                                    <div key={mashup.id} className="flex items-center gap-2 text-xs text-zinc-500">
                                                        <Music className="w-3 h-3 text-zinc-700" />
                                                        <span className="truncate">{mashup.title}</span>
                                                    </div>
                                                ))}
                                                {pack.mashups.length > 3 && (
                                                    <p className="text-[10px] text-zinc-600 pl-5">
                                                        + {pack.mashups.length - 3} más...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                                    <Package className="w-8 h-8 text-zinc-600" />
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">No hay packs disponibles</h3>
                                <p className="text-zinc-500">Pronto se añadirán nuevas colecciones.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
