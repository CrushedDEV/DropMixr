// Components
import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, LogOut } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verificar Email" description="Por favor verifica tu correo electrónico haciendo clic en el enlace que te enviamos.">
            <Head title="Verificar Email" />

            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-blue-400" />
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-3 text-green-400 text-sm text-center">
                    Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Reenviar email de verificación
                </Button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                </Link>
            </form>
        </AuthLayout>
    );
}
