// Components
import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Recuperar Contraseña" description="Ingresa tu correo para recibir un enlace de recuperación">
            <Head title="Recuperar Contraseña" />

            {status && (
                <div className="mb-4 rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-3 text-green-400 text-sm text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Correo electrónico</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="tu@email.com"
                            className="pl-10 bg-white/10 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500 focus:ring-pink-500"
                        />
                    </div>
                    <InputError message={errors.email} className="text-red-400" />
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Enviar enlace de recuperación
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a iniciar sesión
                </Link>
            </div>
        </AuthLayout>
    );
}
