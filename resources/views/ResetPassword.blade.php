<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña - DropMixr</title>
    <style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            padding: 20px 0;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ec4899;
            /* Pink-500 */
            text-decoration: none;
        }

        .card {
            background-color: #111111;
            border: 1px solid #333333;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
        }

        .icon {
            color: #ec4899;
            font-size: 48px;
            margin-bottom: 20px;
        }

        h1 {
            color: #ffffff;
            font-size: 24px;
            margin-bottom: 16px;
        }

        p {
            color: #a1a1aa;
            /* Zinc-400 */
            font-size: 16px;
            margin-bottom: 24px;
        }

        .button {
            display: inline-block;
            background-color: #ec4899;
            color: #ffffff;
            padding: 12px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            margin: 20px 0;
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: #666666;
            font-size: 12px;
        }

        .divider {
            border-top: 1px solid #333333;
            margin: 30px 0;
        }

        .link-break {
            word-break: break-all;
            color: #ec4899;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <a href="{{ url('/') }}" class="logo">DropMixr</a>
        </div>

        <div class="card">
            <div class="icon">🔒</div>
            <h1>Restablecer Contraseña</h1>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no hiciste esta solicitud, puedes
                ignorar este correo de forma segura.</p>

            <a href="{{ $url }}" class="button">Restablecer Contraseña</a>

            <p style="font-size: 14px; margin-top: 20px;">
                Este enlace expirará en 60 minutos.<br>
                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
            </p>
            <p class="link-break">{{ $url }}</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} DropMixr. Todos los derechos reservados.</p>
        </div>
    </div>
</body>

</html>