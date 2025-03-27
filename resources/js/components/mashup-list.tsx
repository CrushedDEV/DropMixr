import BeatCard from "@/components/BeatCard";

export default function MashupList({ mashups }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mashups.length > 0 ? (
                mashups.map((mashup, index) => (
                    <BeatCard
                        key={mashup.id}
                        id={mashup.id}
                        user={mashup.user?.name || "Desconocido"}
                        bpm={mashup.bpm || 0}
                        tonalidad={mashup.key || "N/A"}
                        image={mashup.image || "/default-image.jpg"}
                        audio={mashup.audio || ""}
                        onPlayPause={() => console.log(`Play/Pause mashup ${mashup.id}`)}
                        index={index}
                    />
                ))
            ) : (
                <p className="text-gray-500">No hay mashups disponibles en este momento.</p>
            )}
        </div>
    );
}