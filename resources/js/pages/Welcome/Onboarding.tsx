import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Music, Upload, Download, Coins, Package, ArrowRight, CheckCircle } from 'lucide-react';

export default function Onboarding() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Bienvenido', href: '/onboarding' }]}>
            <Head title="Bienvenido a DropMixr" />

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                        Bienvenido a DropMixr
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        La plataforma definitiva para compartir, descubrir y descargar mashups exclusivos.
                        Aquí te explicamos cómo sacar el máximo provecho.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Feature 1 */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800 transition-all group">
                        <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                            <Upload className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">1. Sube tu Música</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Comparte tus mashups con la comunidad. Aceptamos formatos de alta calidad como MP3, WAV y OGG.
                            <br /><br />
                            <span className="text-pink-400 font-semibold">Ganas créditos</span> cada vez que subes contenido aprobado.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800 transition-all group">
                        <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                            <Coins className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">2. Sistema de Créditos</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Todo funciona con créditos.
                            <ul className="mt-3 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Subir Mashup: <span className="text-white">+2 Créditos</span></li>
                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-400" /> Descargar Track: <span className="text-white">-1 Crédito</span></li>
                            </ul>
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:bg-gray-800 transition-all group">
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                            <Package className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">3. Packs de Música</h3>
                        <p className="text-gray-400 leading-relaxed">
                            ¿Tienes muchos mashups? Crea un <strong>Pack</strong> subiendo un archivo .zip.
                            El precio del pack se calcula automáticamente según la cantidad de canciones que contenga.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-20" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">¿Listo para empezar?</h2>
                            <p className="text-gray-300 text-lg">
                                Explora la biblioteca y descubre los mejores mashups de la comunidad.
                            </p>
                        </div>
                        <Link href={route('explore')}>
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-white/10 transition-all hover:scale-105">
                                <Music className="w-5 h-5 mr-2" />
                                Ir a Explorar
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
