import BeatCard from "@/components/BeatCard";
import { useState } from 'react';

interface MashupListProps {
    mashups: any[];
    viewMode?: 'grid' | 'list';
}

export default function MashupList({ mashups, viewMode = 'grid' }: MashupListProps) {
    if (mashups.length === 0) {
        return <p className="text-center text-gray-500 py-10">No hay mashups disponibles en este momento.</p>;
    }

    if (viewMode === 'list') {
        return (
            <div className="flex flex-col gap-2">
                {mashups.map((mashup, index) => (
                    <BeatCard
                        key={mashup.id}
                        id={mashup.id}
                        title={mashup.title || "Sin título"}
                        user={mashup.user?.name || "Desconocido"}
                        bpm={mashup.bpm || 0}
                        tonalidad={mashup.key || "N/A"}
                        image={mashup.image || "/default-image.jpg"}
                        audio={mashup.audio || ""}
                        index={index}
                        viewMode="list"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mashups.map((mashup, index) => (
                <BeatCard
                    key={mashup.id}
                    id={mashup.id}
                    title={mashup.title || "Sin título"}
                    user={mashup.user?.name || "Desconocido"}
                    bpm={mashup.bpm || 0}
                    tonalidad={mashup.key || "N/A"}
                    image={mashup.image || "/default-image.jpg"}
                    audio={mashup.audio || ""}
                    index={index}
                    viewMode="grid"
                />
            ))}
        </div>
    );
}