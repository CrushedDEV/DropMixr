<x-mail::message>
    # Tienes Mashups Pendientes

    Hola Admin,

    Hay **{{ $count }}** nuevos mashups que han estado esperando aprobación por más de 30 minutos.

    Por favor, revisa el panel de administración para aprobarlos o rechazarlos.

    <x-mail::button :url="$url">
        Ir al Panel de Administración
    </x-mail::button>

    Gracias,<br>
    {{ config('app.name') }}
</x-mail::message>