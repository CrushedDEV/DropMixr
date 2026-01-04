import { Head, useForm as useInertiaForm } from '@inertiajs/react';
import { LoaderCircle, Music, ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/header';

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  password_confirmation: z.string().min(6, { message: 'La confirmación de la contraseña debe tener al menos 6 caracteres' }),
});

type RegisterForm = z.infer<typeof formSchema>;

export default function Register() {
  const { setData, post, processing, errors, reset } = useInertiaForm<Required<RegisterForm>>({
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
    <>
      <Head title="Crear cuenta" />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30">
        <Header />

        {/* Background Effects */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[130px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-24">
          <div className="w-full max-w-md">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 shadow-xl shadow-pink-500/20 mb-6 group transition-transform hover:scale-110 duration-500">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-2">
                Únete a DropMixr
              </h1>
              <p className="text-gray-400">Comparte y descubre mashups increíbles</p>
            </div>

            {/* Register Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 ml-1">Nombre de usuario</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      autoFocus
                      autoComplete="name"
                      onChange={(e) => {
                        form.setValue('name', e.target.value);
                        setData('name', e.target.value);
                      }}
                      placeholder="Tu nombre artístico"
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl"
                    />
                    <InputError message={errors.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 ml-1">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      onChange={(e) => {
                        form.setValue('email', e.target.value);
                        setData('email', e.target.value);
                      }}
                      placeholder="nombre@ejemplo.com"
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl"
                    />
                    <InputError message={errors.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300 ml-1">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      autoComplete="new-password"
                      onChange={(e) => {
                        form.setValue('password', e.target.value);
                        setData('password', e.target.value);
                      }}
                      placeholder="Al menos 6 caracteres"
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl"
                    />
                    <InputError message={errors.password} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-gray-300 ml-1">Confirmar contraseña</Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      required
                      onChange={(e) => {
                        form.setValue('password_confirmation', e.target.value);
                        setData('password_confirmation', e.target.value);
                      }}
                      placeholder="Repite tu contraseña"
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl"
                    />
                    <InputError message={errors.password_confirmation} />
                  </div>

                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  disabled={processing}
                >
                  {processing ? (
                    <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <>
                      Crear Cuenta <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-400">
                    ¿Ya eres miembro?{' '}
                    <TextLink href={route('login')} className="text-white hover:text-pink-400 font-medium transition-colors">
                      Inicia sesión
                    </TextLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}