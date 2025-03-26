import { Card, CardContent } from "@/components/ui/card";
import { UploadCloudIcon, MusicIcon, UsersIcon } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-4xl font-semibold mb-6 text-indigo-400">¿Cómo Funciona DropMix?</h2>
      <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-300">
        En DropMix, solo podrás acceder a los mashups de la comunidad si subes el tuyo. Comparte tus mezclas y descubre nuevas inspiraciones.
      </p>
      <div className="flex justify-center gap-8">
        {[ 
          { icon: UploadCloudIcon, title: "Sube tu Mashup", desc: "Comparte tu mezcla original y desbloquea acceso a una colección exclusiva de mashups." },
          { icon: MusicIcon, title: "Descubre Nuevas Mezclas", desc: "Accede a mashups de otros creadores y encuentra sonidos nuevos para tus sets." },
          { icon: UsersIcon, title: "Conéctate con Otros DJs", desc: "Forma parte de una comunidad exclusiva de DJs y productores apasionados." }
        ].map(({ icon: Icon, title, desc }, index) => (
          <Card key={index} className="w-full max-w-xs bg-gray-900 border border-indigo-500">
            <CardContent className="flex flex-col items-center text-center">
              <Icon className="h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
              <p className="text-gray-300">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
