import { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Package, X, Check, Music } from 'lucide-react';
import InputError from '@/components/input-error';

interface Mashup {
    id: number;
    title: string;
    image_path: string;
}

export default function PacksCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        cover_image: null as File | null,
        file: null as File | null,
    });



    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('packs.store'));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Packs', href: '/packs' }, { title: 'Crear', href: '/packs/create' }]}>
            <Head title="Crear Pack" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Crear Nuevo Pack</h1>
                    <p className="text-gray-400">Sube un archivo Zip con tus mashups. El precio se calculará automáticamente.</p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-white">Título del Pack</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Ej: Verano 2026 Hits"
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file" className="text-white">Archivo Pack (.zip)</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".zip"
                                    onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
                                    className="bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0"
                                />
                                <InputError message={errors.file} />
                                <p className="text-xs text-gray-500">
                                    El precio se calculará automáticamente: Costo x Canciones Válidas (mp3, wav, ogg, m4a).
                                </p>
                            </div>

                            <div className="col-span-full space-y-2">
                                <Label htmlFor="description" className="text-white">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                                    placeholder="Describe qué contiene este pack..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="col-span-full space-y-2">
                                <Label htmlFor="cover_image" className="text-white">Imagen de Portada (Opcional)</Label>
                                <Input
                                    id="cover_image"
                                    type="file"
                                    onChange={e => setData('cover_image', e.target.files ? e.target.files[0] : null)}
                                    className="bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0"
                                    accept="image/*"
                                />
                                <InputError message={errors.cover_image} />
                            </div>
                        </div>
                    </div>



                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="ghost" onClick={() => window.history.back()} className="text-gray-400 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-pink-600 hover:bg-pink-700">
                            {processing ? 'Subiendo y Procesando...' : 'Publicar Pack'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
