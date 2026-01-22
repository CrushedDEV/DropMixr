@extends('emails.layout')

@section('content')
    <div style="text-align: center;">
        <div class="icon-container">⚡</div>
        <h1>Verifica tu cuenta</h1>

        <p>Hola <strong>{{ $notifiable->name ?? 'DJ' }}</strong>,</p>

        <p>¡Bienvenido a <strong>DropMixr</strong>! Estás a un solo paso de unirte a la plataforma más exclusiva de mashups
            y edits.</p>

        <p>Para activar tu cuenta y empezar a descargar y subir música, necesitamos confirmar que este es tu correo
            electrónico.</p>

        <a href="{{ $url }}" class="button" target="_blank">Verificar Correo Electrónico</a>

        <div class="sub">
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all;">
                <a href="{{ $url }}">{{ $url }}</a>
            </p>
        </div>
    </div>
@endsection