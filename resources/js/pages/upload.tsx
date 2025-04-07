import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function UploadMashup() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    file_path: null,
    bpm: "",
    key: "",
    duration: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/mashups", {
      onSuccess: () => alert("Mashup subido exitosamente."),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans p-6">
      <h1 className="text-3xl font-semibold mb-6">Subir Mashup</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        <div>
          <Label htmlFor="title" className="block text-sm font-medium mb-2">
            Título
          </Label>
          <Input
            id="title"
            type="text"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
            className="w-full"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="file_path" className="block text-sm font-medium mb-2">
            Archivo de Audio
          </Label>
          <Input
            id="file_path"
            type="file"
            onChange={(e) => setData("file_path", e.target.files[0])}
            className="w-full"
          />
          {errors.file_path && <p className="text-red-500 text-sm">{errors.file_path}</p>}
        </div>

        <div>
          <Label htmlFor="bpm" className="block text-sm font-medium mb-2">
            BPM
          </Label>
          <Input
            id="bpm"
            type="number"
            value={data.bpm}
            onChange={(e) => setData("bpm", e.target.value)}
            className="w-full"
          />
          {errors.bpm && <p className="text-red-500 text-sm">{errors.bpm}</p>}
        </div>

        <div>
          <Label htmlFor="key" className="block text-sm font-medium mb-2">
            Tonalidad
          </Label>
          <Input
            id="key"
            type="text"
            value={data.key}
            onChange={(e) => setData("key", e.target.value)}
            className="w-full"
          />
          {errors.key && <p className="text-red-500 text-sm">{errors.key}</p>}
        </div>

        <div>
          <Label htmlFor="duration" className="block text-sm font-medium mb-2">
            Duración (segundos)
          </Label>
          <Input
            id="duration"
            type="number"
            value={data.duration}
            onChange={(e) => setData("duration", e.target.value)}
            className="w-full"
          />
          {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="block text-sm font-medium mb-2">
            Descripción
          </Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="w-full"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <Button
          type="submit"
          disabled={processing}
          className="w-full bg-indigo-500 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold"
        >
          {processing ? "Subiendo..." : "Subir Mashup"}
        </Button>
      </form>
    </div>
  );
}