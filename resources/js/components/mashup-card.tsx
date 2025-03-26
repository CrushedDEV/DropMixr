export default function MashupCard({ mashup }) {
    return (
        <div className="border rounded-lg shadow-md p-4">
            <img
                src={mashup.image}
                alt={mashup.title}
                className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold">{mashup.title}</h2>
            <p className="text-gray-600">{mashup.description}</p>
        </div>
    );
}