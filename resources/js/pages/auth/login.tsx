import { Head, useForm as useInertiaForm } from '@inertiajs/react';
import { LoaderCircle, Music, ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/header';

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
  const { setData, post, processing, errors, reset } = useInertiaForm<Required<LoginForm>>({
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
    <>
      <Head title="Iniciar sesión" />
      <div className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30">
        <Header />

        {/* Background Effects */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 shadow-xl shadow-purple-500/20 mb-6 group transition-transform hover:scale-110 duration-500">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-2">
                Bienvenido de nuevo
              </h1>
              <p className="text-gray-400">Ingresa a tu cuenta para continuar</p>
            </div>

            {/* Login Card */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300 ml-1">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      autoFocus
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-gray-300 ml-1">Contraseña</Label>
                      {canResetPassword && (
                        <TextLink href={route('password.request')} className="text-xs text-pink-400 hover:text-pink-300 transition-colors">
                          ¿Olvidaste tu contraseña?
                        </TextLink>
                      )}
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      onChange={(e) => {
                        form.setValue('password', e.target.value);
                        setData('password', e.target.value);
                      }}
                      placeholder="••••••••"
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 h-12 rounded-xl"
                    />
                    <InputError message={errors.password} />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <Checkbox
                      id="remember"
                      onCheckedChange={(checked) => {
                        const val = checked === true;
                        form.setValue('remember', val);
                        setData('remember', val);
                      }}
                      className="border-white/20 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">
                      Mantener sesión iniciada
                    </Label>
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
                      Iniciar Sesión <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-white/5">
                  <p className="text-sm text-gray-400">
                    ¿Aún no tienes cuenta?{' '}
                    <TextLink href={route('register')} className="text-white hover:text-pink-400 font-medium transition-colors">
                      Regístrate gratis
                    </TextLink>
                  </p>
                </div>
              </form>

              {status && (
                <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center text-sm font-medium text-green-400">
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}