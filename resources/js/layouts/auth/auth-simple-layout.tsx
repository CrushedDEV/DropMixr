import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { Music } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/50 p-4 flex justify-between items-center z-50">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    DropMixr
                </Link>
                <nav>
                    <ul className="flex gap-6 text-sm">
                        <li><Link href="/" className="hover:text-pink-500 transition-colors">Inicio</Link></li>
                        <li><Link href="/explore" className="hover:text-pink-500 transition-colors">Explorar</Link></li>
                        <li><Link href="/about" className="hover:text-pink-500 transition-colors">Sobre Nosotros</Link></li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen px-4 py-20">
                <div className="w-full max-w-md">
                    <div className="bg-white/5 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                        {/* Logo and Title */}
                        <div className="flex flex-col items-center mb-8">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                                    <Music className="w-6 h-6 text-white" />
                                </div>
                            </Link>
                            <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                            <p className="text-gray-400 text-center text-sm">{description}</p>
                        </div>

                        {/* Form Content */}
                        {children}
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
