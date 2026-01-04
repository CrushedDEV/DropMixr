// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Lock, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title="Confirmar Contraseña"
            description="Esta es una zona segura. Por favor confirma tu contraseña antes de continuar."
        >
            <Head title="Confirmar Contraseña" />

            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-amber-400" />
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Tu contraseña"
                            autoComplete="current-password"
                            value={data.password}
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            className="pl-10 bg-white/10 border-gray-700 text-white placeholder-gray-500 focus:border-pink-500"
                        />
                    </div>
                    <InputError message={errors.password} className="text-red-400" />
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Confirmar contraseña
                </Button>
            </form>
        </AuthLayout>
    );
}
