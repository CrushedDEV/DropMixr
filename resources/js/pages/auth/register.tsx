import { Head, useForm as useInertiaForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  password_confirmation: z.string().min(6, { message: 'La confirmación de la contraseña debe tener al menos 6 caracteres' }),
});

type RegisterForm = z.infer<typeof formSchema>;

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useInertiaForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const form = useForm<RegisterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    const values = form.getValues();
    setData(values);
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen font-sans flex items-center justify-center">
      <Head title="Crear cuenta" />
      
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
      <div className="flex justify-center items-center min-h-screen px-6 py-12 w-xl">
        <Card className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl shadow-2xl w-full max-w-6xl border border-pink-500">
          <h2 className="text-4xl font-semibold text-center text-white mb-8">Crear cuenta</h2>

          <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Nombre completo"
                  className="bg-white/20 text-white placeholder-gray-400"
                />
                <InputError message={errors.name} className="text-red-500" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white/20 text-white placeholder-gray-400"
                />
                <InputError message={errors.email} className="text-red-500" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Contraseña"
                  className="bg-white/20 text-white placeholder-gray-400"
                />
                <InputError message={errors.password} className="text-red-500" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation" className="text-white">Confirmar contraseña</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Confirmar contraseña"
                  className="bg-white/20 text-white placeholder-gray-400"
                />
                <InputError message={errors.password_confirmation} className="text-red-500" />
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-500 text-white hover:bg-pink-600"
                disabled={processing}
              >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Crear cuenta
              </Button>
            </div>

            <div className="text-center text-sm text-white">
              ¿Ya tienes una cuenta?{' '}
              <TextLink href={route('login')} className="text-indigo-400">
                Iniciar sesión
              </TextLink>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}