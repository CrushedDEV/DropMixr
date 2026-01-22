@extends('emails.layout')

@section('content')
    <div style="text-align: center;">
        <div class="icon-container">🔒</div>
        <h1>Restablecer Contraseña</h1>

        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en DropMixr.</p>

        <p>Si no has sido tú, puedes ignorar este mensaje sin problemas. Tu cuenta sigue segura.</p>

        <a href="{{ $url }}" class="button" target="_blank">Restablecer Contraseña</a>

        <p>Este enlace expirará en <strong>60 minutos</strong> por seguridad.</p>

        <div class="sub">
            <p>Si tienes problemas con el botón, usa este enlace directo:</p>
            <p style="word-break: break-all;">
                <a href="{{ $url }}">{{ $url }}</a>
            </p>
        </div>
    </div>
@endsection