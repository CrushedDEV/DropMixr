import { Head, useForm as useInertiaForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  remember: z.boolean(),
});

type LoginForm = z.infer<typeof formSchema>;

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useInertiaForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const form = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    const values = form.getValues();
    setData(values);
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen font-sans flex items-center justify-center">
      <Head title="Iniciar sesión" />
      
      {/* Header */}
      <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/50 text-white p-4 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold">DropMix</h1>
        <nav>
          <ul className="flex gap-4">
            <li><a href="/" className="hover:text-pink-500">Inicio</a></li>
            <li><a href="/explore" className="hover:text-pink-500">Explorar</a></li>
            <li><a href="/about" className="hover:text-pink-500">Sobre Nosotros</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen w-xl px-6 py-12">
        <Card className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl w-full max-w-6xl border border-indigo-500">
          <h2 className="text-4xl font-semibold text-center text-white mb-8">Inicia sesión</h2>

          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white/20 text-white placeholder-gray-400"
                />
                <InputError message={errors.email} className="text-red-500" />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Contraseña</Label>
                  {canResetPassword && (
                    <TextLink href={route('password.request')} className="text-sm text-indigo-400">
                      ¿Olvidaste tu contraseña?
                    </TextLink>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Contraseña"
                  className="bg-white/20 text-white placeholder-gray-400"
                />
                <InputError message={errors.password} className="text-red-500" />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  checked={data.remember}
                  onCheckedChange={() => setData('remember', !data.remember)}
                  className="rounded-md border-gray-600 text-indigo-500"
                />
                <Label htmlFor="remember" className="text-sm text-white">
                  Recuérdame
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={processing}
              >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Iniciar sesión
              </Button>
            </div>

            <div className="text-center text-sm text-white">
              ¿No tienes una cuenta?{' '}
              <TextLink href={route('register')} className="text-indigo-400">
                Regístrate
              </TextLink>
            </div>
          </form>

          {status && <div className="mt-4 text-center text-sm text-green-600">{status}</div>}
        </Card>
      </div>
    </div>
  );
}