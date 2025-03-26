import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import MashupCard from '@/components/mashup-card'; // Componente para mostrar cada mashup
import { useState, useEffect } from 'react';

export default function Explore() {
    const [mashups, setMashups] = useState([]);

    useEffect(() => {
        // Simulación de una llamada a la API para obtener los mashups
        fetch('/api/mashups')
            .then((response) => response.json())
            .then((data) => setMashups(data))
            .catch((error) => console.error('Error fetching mashups:', error));
    }, []);

    return (
        <AppLayout>
            <Head title="Explore Mashups" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-6">Explore Mashups</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mashups.length > 0 ? (
                        mashups.map((mashup) => (
                            <MashupCard key={mashup.id} mashup={mashup} />
                        ))
                    ) : (
                        <p className="text-gray-500">No mashups available at the moment.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}