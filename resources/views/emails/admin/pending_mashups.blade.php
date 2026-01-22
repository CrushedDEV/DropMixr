@extends('emails.layout')

@section('content')
    <div style="text-align: center;">
        <div class="icon-container">🎵</div>
        <h1>Tienes Mashups Pendientes</h1>

        <p>Hola <strong>Admin</strong>,</p>

        <p>Hay <strong>{{ $count }}</strong> nuevos mashups que han estado esperando aprobación por más de 30 minutos.</p>

        <p>Por favor, revisa el panel de administración para aprobarlos o rechazarlos.</p>

        <a href="{{ $url }}" class="button" target="_blank">Ir al Panel de Administración</a>

        <div class="sub">
            <p>Gracias por mantener la calidad de DropMixr.</p>
        </div>
    </div>
@endsection