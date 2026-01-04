import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Music, Image as ImageIcon, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  bpm: string;
  key: string;
  type: string;
  is_public: boolean;
  audio: File | null;
  image: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateMashup() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    bpm: '',
    key: '',
    type: 'Mashup',
    is_public: true,
    audio: null,
    image: null,
  });

  const [audioPreview, setAudioPreview] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpiar errores del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('audio/')) {
        setErrors((prev) => ({
          ...prev,
          audio: 'El archivo debe ser un archivo de audio válido',
        }));
        return;
      }

      // Validar tamaño (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          audio: 'El archivo de audio no debe superar 50MB',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        audio: file,
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        audio: '',
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: 'El archivo debe ser una imagen válida',
        }));
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'La imagen no debe superar 5MB',
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        image: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.audio) {
      newErrors.audio = 'El archivo de audio es requerido';
    }

    if (!formData.image) {
      newErrors.image = 'La imagen es requerida';
    }

    if (formData.bpm && isNaN(parseInt(formData.bpm))) {
      newErrors.bpm = 'El BPM debe ser un número';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('bpm', formData.bpm || '');
      formDataToSend.append('key', formData.key);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('is_public', formData.is_public ? '1' : '0');

      if (formData.audio) {
        formDataToSend.append('file_path', formData.audio);
      }

      if (formData.image) {
        formDataToSend.append('image_path', formData.image);
      }

      // Enviar al servidor usando Inertia con manejo de errores mejorado
      router.post('/mashups', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onSuccess: () => {
          setSubmitStatus('success');
          setErrorMessage('');

          // Limpiar formulario después de 2 segundos
          setTimeout(() => {
            router.visit('/explore');
          }, 2000);
        },
        onError: (errors) => {
          console.error('Upload errors:', errors);
          setSubmitStatus('error');

          // Obtener el mensaje de error del servidor
          if (errors && typeof errors === 'object') {
            const errorMessages = Object.values(errors).flat();
            setErrorMessage(errorMessages.length > 0 ? String(errorMessages[0]) : 'Error al subir el mashup. Intenta nuevamente.');
            setErrors(errors as FormErrors);
          } else {
            setErrorMessage('Error al subir el mashup. Intenta nuevamente.');
          }
        },
      });
    } catch (error) {
      console.error('Error al subir el mashup:', error);
      setSubmitStatus('error');
      setErrorMessage('Error al procesar el formulario. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Head title="Crear Mashup" />

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
          <Link href="/explore" className="flex items-center space-x-2 text-pink-500 hover:text-pink-400 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Explorar</span>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Crear Nuevo Mashup</h1>
          <div className="flex justify-between items-end">
            <p className="text-gray-400">Sube tu beat y comparte tu creatividad con la comunidad</p>
            <Link href="/mashups/batch">
              <Button variant="outline" className="text-pink-400 border-pink-500/30 hover:bg-pink-500/10">
                Cambiar a Subida Múltiple
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Estado del envío */}
              {submitStatus === 'success' && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-400">¡Mashup creado exitosamente!</h3>
                    <p className="text-sm text-green-400/80">Tu mashup ha sido subido y está esperando aprobación</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-400">Error al crear el mashup</h3>
                    <p className="text-sm text-red-400/80">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Información Básica */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  <Music className="w-5 h-5 text-pink-500" />
                  <span>Información Básica</span>
                </h2>

                <div className="space-y-4">
                  {/* Título */}
                  <div>
                    <Label htmlFor="title" className="text-base mb-2">
                      Título del Mashup *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Ej: Mi primer beat épico"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`bg-gray-700/50 border ${errors.title ? 'border-red-500' : 'border-gray-600'
                        } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.title}</span>
                      </p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <Label htmlFor="description" className="text-base mb-2">
                      Descripción
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Describe tu mashup..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                    />
                  </div>

                  {/* BPM y Key */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bpm" className="text-base mb-2">
                        BPM
                      </Label>
                      <Input
                        id="bpm"
                        name="bpm"
                        type="number"
                        placeholder="120"
                        value={formData.bpm}
                        onChange={handleInputChange}
                        className={`bg-gray-700/50 border ${errors.bpm ? 'border-red-500' : 'border-gray-600'
                          } rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors`}
                      />
                      {errors.bpm && (
                        <p className="text-red-400 text-sm mt-1">{errors.bpm}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="key" className="text-base mb-2">
                        Tonalidad
                      </Label>
                      <Input
                        id="key"
                        name="key"
                        type="text"
                        placeholder="C Mayor"
                        value={formData.key}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Tipo */}
                  <div>
                    <Label htmlFor="type" className="text-base mb-2">
                      Tipo de Audio
                    </Label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors appearance-none"
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

                  {/* Público */}
                  <div className="flex items-center space-x-3">
                    <input
                      id="is_public"
                      name="is_public"
                      type="checkbox"
                      checked={formData.is_public}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-pink-600"
                    />
                    <Label htmlFor="is_public" className="text-base cursor-pointer">
                      Hacer público (visible para todos)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Archivos */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-pink-500" />
                  <span>Archivos</span>
                </h2>

                <div className="space-y-6">
                  {/* Audio */}
                  <div>
                    <Label className="text-base mb-3 block">Archivo de Audio (MP3, WAV, OGG) *</Label>
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.audio
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-gray-600 hover:border-pink-500 bg-gray-700/20 hover:bg-gray-700/40'
                        }`}
                    >
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        className="hidden"
                      />

                      {audioPreview ? (
                        <div className="flex flex-col items-center space-y-3">
                          <div className="bg-pink-500/20 p-3 rounded-lg">
                            <Music className="w-6 h-6 text-pink-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-400">Archivo cargado</p>
                            <p className="text-sm text-gray-400">{formData.audio?.name}</p>
                          </div>
                          <audio src={audioPreview} controls className="w-full mt-3 max-w-xs" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <Music className="w-8 h-8 text-gray-400" />
                          <p className="font-semibold">Arrastra tu archivo de audio aquí</p>
                          <p className="text-sm text-gray-400">o haz clic para seleccionar (máx. 50MB)</p>
                        </div>
                      )}
                    </div>
                    {errors.audio && (
                      <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.audio}</span>
                      </p>
                    )}
                  </div>

                  {/* Imagen */}
                  <div>
                    <Label className="text-base mb-3 block">Portada (JPG, PNG, WebP) *</Label>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${errors.image
                        ? 'border-red-500 bg-red-500/5'
                        : 'border-gray-600 hover:border-pink-500 bg-gray-700/20 hover:bg-gray-700/40'
                        }`}
                    >
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      {imagePreview ? (
                        <div className="flex flex-col items-center space-y-3">
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                          <div>
                            <p className="font-semibold text-green-400">Imagen cargada</p>
                            <p className="text-sm text-gray-400">{formData.image?.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                          <p className="font-semibold">Arrastra la portada aquí</p>
                          <p className="text-sm text-gray-400">o haz clic para seleccionar (máx. 5MB)</p>
                        </div>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.image}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Subir Mashup</span>
                    </>
                  )}
                </Button>
                <Link href="/explore">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          {/* Barra lateral con información */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Consejos</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Usa un título descriptivo y único</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Incluye una portada atractiva (1:1 recomendado)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Especifica el BPM y tonalidad correctos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Describe tu inspiración en la descripción</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>Tu mashup será revisado antes de publicarse</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                <p className="text-sm text-pink-400">
                  <strong>Nota:</strong> Asegúrate de tener los derechos sobre el audio y la imagen que subes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}