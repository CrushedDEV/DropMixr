import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Music, X, CheckCircle, Loader, AlertCircle, Trash2 } from 'lucide-react';

interface MashupItem {
    id: string;
    file: File;
    title: string;
    bpm: string;
    key: string;
    type: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
    progress: number;
}

export default function BatchUpload() {
    const [mashups, setMashups] = useState<MashupItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
    const [sharedImage, setSharedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const newMashups: MashupItem[] = files
            .filter(file => file.type.startsWith('audio/'))
            .map(file => ({
                id: crypto.randomUUID(),
                file,
                title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                bpm: '',
                key: '',
                type: 'Mashup',
                status: 'pending' as const,
                progress: 0,
            }));

        setMashups(prev => [...prev, ...newMashups]);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSharedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const updateMashup = (id: string, updates: Partial<MashupItem>) => {
        setMashups(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const removeMashup = (id: string) => {
        setMashups(prev => prev.filter(m => m.id !== id));
    };

    const uploadSingleMashup = async (mashup: MashupItem): Promise<boolean> => {
        return new Promise((resolve) => {
            const formData = new FormData();
            formData.append('title', mashup.title);
            formData.append('bpm', mashup.bpm || '');
            formData.append('key', mashup.key || '');
            formData.append('type', mashup.type || 'Mashup');
            formData.append('is_public', '1');
            formData.append('description', '');
            formData.append('file_path', mashup.file);

            if (sharedImage) {
                formData.append('image_path', sharedImage);
            }

            router.post('/mashups', formData, {
                forceFormData: true,
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    updateMashup(mashup.id, { status: 'success', progress: 100 });
                    resolve(true);
                },
                onError: (errors) => {
                    const errorMsg = Object.values(errors).flat()[0] || 'Error al subir';
                    updateMashup(mashup.id, { status: 'error', error: String(errorMsg) });
                    resolve(false);
                },
            });
        });
    };

    const handleUploadAll = async () => {
        if (!sharedImage) {
            alert('Por favor selecciona una imagen de portada');
            return;
        }

        const pendingMashups = mashups.filter(m => m.status === 'pending' || m.status === 'error');
        if (pendingMashups.length === 0) return;

        setIsUploading(true);

        for (let i = 0; i < pendingMashups.length; i++) {
            setCurrentUploadIndex(i);
            updateMashup(pendingMashups[i].id, { status: 'uploading', progress: 50 });
            await uploadSingleMashup(pendingMashups[i]);
        }

        setIsUploading(false);
    };

    const successCount = mashups.filter(m => m.status === 'success').length;
    const pendingCount = mashups.filter(m => m.status === 'pending' || m.status === 'error').length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
            <Head title="Subida Múltiple" />

            {/* Header */}
            <div className="border-b border-gray-800">
                <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
                    <Link href="/explore" className="flex items-center space-x-2 text-pink-500 hover:text-pink-400 mb-4">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver a Explorar</span>
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Subida Múltiple de Mashups</h1>
                    <div className="flex justify-between items-end">
                        <p className="text-gray-400">Sube varios mashups a la vez. Todos usarán la misma imagen de portada.</p>
                        <Link href="/mashups/create">
                            <Button variant="outline" className="text-pink-400 border-pink-500/30 hover:bg-pink-500/10">
                                Cambiar a Subida Individual
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Files selection */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Music className="w-5 h-5 text-pink-500" />
                                Archivos de Audio
                            </h2>

                            <div
                                onClick={() => audioInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 hover:border-pink-500 rounded-lg p-8 text-center cursor-pointer transition-colors"
                            >
                                <input
                                    ref={audioInputRef}
                                    type="file"
                                    accept="audio/*"
                                    multiple
                                    onChange={handleFilesSelected}
                                    className="hidden"
                                />
                                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                <p className="font-semibold">Haz clic para seleccionar archivos de audio</p>
                                <p className="text-sm text-gray-400 mt-1">Puedes seleccionar múltiples archivos (MP3, WAV, OGG)</p>
                            </div>
                        </div>

                        {/* Mashups list */}
                        {mashups.length > 0 && (
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Mashups ({mashups.length})
                                    </h2>
                                    {pendingCount > 0 && (
                                        <span className="text-sm text-gray-400">
                                            {successCount} subidos, {pendingCount} pendientes
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {mashups.map((mashup, index) => (
                                        <div
                                            key={mashup.id}
                                            className={`border rounded-lg p-4 ${mashup.status === 'success' ? 'border-green-500/50 bg-green-500/5' :
                                                mashup.status === 'error' ? 'border-red-500/50 bg-red-500/5' :
                                                    mashup.status === 'uploading' ? 'border-amber-500/50 bg-amber-500/5' :
                                                        'border-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        {mashup.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                        {mashup.status === 'uploading' && <Loader className="w-5 h-5 text-amber-500 animate-spin" />}
                                                        {mashup.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                                        {mashup.status === 'pending' && <Music className="w-5 h-5 text-gray-400" />}

                                                        <Input
                                                            value={mashup.title}
                                                            onChange={(e) => updateMashup(mashup.id, { title: e.target.value })}
                                                            disabled={mashup.status !== 'pending' && mashup.status !== 'error'}
                                                            className="bg-gray-700/50 border-gray-600 text-white"
                                                            placeholder="Título"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3">
                                                        <Input
                                                            value={mashup.bpm}
                                                            onChange={(e) => updateMashup(mashup.id, { bpm: e.target.value })}
                                                            disabled={mashup.status !== 'pending' && mashup.status !== 'error'}
                                                            className="bg-gray-700/50 border-gray-600 text-white"
                                                            placeholder="BPM"
                                                            type="number"
                                                        />
                                                        <Input
                                                            value={mashup.key}
                                                            onChange={(e) => updateMashup(mashup.id, { key: e.target.value })}
                                                            disabled={mashup.status !== 'pending' && mashup.status !== 'error'}
                                                            className="bg-gray-700/50 border-gray-600 text-white"
                                                            placeholder="Tonalidad"
                                                        />
                                                        <select
                                                            value={mashup.type}
                                                            onChange={(e) => updateMashup(mashup.id, { type: e.target.value })}
                                                            disabled={mashup.status !== 'pending' && mashup.status !== 'error'}
                                                            className="bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors appearance-none text-sm"
                                                        >
                                                            <option value="Mashup">Mashup</option>
                                                            <option value="Extended">Extended</option>
                                                            <option value="Vocal In">Vocal In</option>
                                                            <option value="Vocal Out">Vocal Out</option>
                                                            <option value="Original">Original</option>
                                                            <option value="Edit">Edit</option>
                                                            <option value="Remix">Remix</option>
                                                        </select>
                                                    </div>

                                                    {mashup.error && (
                                                        <p className="text-sm text-red-400">{mashup.error}</p>
                                                    )}

                                                    <p className="text-xs text-gray-500">{mashup.file.name}</p>
                                                </div>

                                                {(mashup.status === 'pending' || mashup.status === 'error') && (
                                                    <button
                                                        onClick={() => removeMashup(mashup.id)}
                                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>

                                            {mashup.status === 'uploading' && (
                                                <div className="mt-3">
                                                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-gradient-to-r from-pink-600 to-purple-600 animate-pulse" style={{ width: '50%' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload button */}
                        {mashups.length > 0 && pendingCount > 0 && (
                            <Button
                                onClick={handleUploadAll}
                                disabled={isUploading || !sharedImage}
                                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 py-6 text-lg"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin mr-2" />
                                        Subiendo {currentUploadIndex + 1} de {pendingCount}...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Subir {pendingCount} Mashup{pendingCount > 1 ? 's' : ''}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Sidebar - Shared image */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 sticky top-6">
                            <h3 className="text-lg font-semibold mb-4">Imagen de Portada</h3>
                            <p className="text-sm text-gray-400 mb-4">Esta imagen se usará para todos los mashups</p>

                            <div
                                onClick={() => imageInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-600 hover:border-pink-500 rounded-lg p-6 text-center cursor-pointer transition-colors"
                            >
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full aspect-square object-cover rounded-lg" />
                                ) : (
                                    <div className="py-8">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm">Seleccionar imagen</p>
                                    </div>
                                )}
                            </div>

                            {!sharedImage && mashups.length > 0 && (
                                <p className="text-amber-400 text-sm mt-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Selecciona una imagen antes de subir
                                </p>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
