<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>{{ $subject ?? 'DropMixr' }}</title>
    <style type="text/css">
        /* Base reset */
        body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            line-height: 1.6;
            background-color: #09090b;
            /* Zinc 950 */
            color: #ec4899;
            /* Primary Pink */
            -webkit-text-size-adjust: none;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        a {
            color: #ec4899;
            text-decoration: none;
            font-weight: 600;
        }

        a:hover {
            color: #d946ef;
        }

        /* Layout */
        .email-wrapper {
            width: 100%;
            margin: 0;
            padding: 40px 0;
            background-color: #09090b;
        }

        .email-content {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 50px rgba(236, 72, 153, 0.15);
            /* Pink glow */
        }

        /* Card */
        .email-body {
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #18181b;
            /* Zinc 900 */
            border: 1px solid #27272a;
            /* Zinc 800 */
        }

        .email-body_inner {
            width: 100%;
            margin: 0 auto;
            padding: 48px;
            box-sizing: border-box;
        }

        /* Header */
        .email-masthead {
            padding: 32px 0;
            text-align: center;
            background: linear-gradient(180deg, rgba(24, 24, 27, 0) 0%, #18181b 100%);
            border-bottom: 1px solid #27272a;
        }

        .email-masthead_logo {
            max-width: 180px;
            height: auto;
            display: block;
            margin: 0 auto;
        }

        .email-masthead_name {
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
        }

        /* Components */
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
            color: #ffffff !important;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            border-radius: 9999px;
            /* Pill shape */
            padding: 14px 40px;
            margin: 32px 0;
            box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.1);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* Typography */
        h1 {
            font-size: 26px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 24px;
            color: #ffffff;
            text-align: center;
            letter-spacing: -0.5px;
        }

        p {
            margin-top: 0;
            margin-bottom: 24px;
            color: #a1a1aa;
            /* Zinc 400 */
            font-size: 16px;
            line-height: 1.75;
        }

        strong {
            color: #e4e4e7;
            /* Zinc 200 */
            font-weight: 600;
        }

        .sub {
            margin-top: 40px;
            padding-top: 32px;
            border-top: 1px solid #27272a;
        }

        .sub p {
            font-size: 13px;
            line-height: 1.5;
            color: #52525b;
            /* Zinc 600 */
            margin-bottom: 0;
        }

        .sub a {
            font-size: 13px;
            word-break: break-all;
            color: #71717a;
            /* Zinc 500 */
        }

        /* Icon Container */
        .icon-container {
            font-size: 48px;
            margin-bottom: 24px;
            display: inline-block;
            padding: 16px;
            background: rgba(236, 72, 153, 0.1);
            border-radius: 50%;
            border: 1px solid rgba(236, 72, 153, 0.2);
        }

        /* Footer */
        .email-footer {
            width: 100%;
            margin: 0 auto;
            padding: 32px;
            text-align: center;
        }

        .email-footer p {
            color: #52525b;
            font-size: 12px;
            margin-bottom: 8px;
        }

        .email-footer a {
            color: #71717a;
            font-size: 12px;
            margin: 0 8px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-content {
                width: 100% !important;
                border-radius: 0;
            }

            .email-body_inner {
                padding: 32px 20px !important;
            }

            .button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>

<body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <!-- Logo Header outside card -->
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td class="email-masthead">
                            <a href="{{ config('app.url') }}" target="_blank">
                                <img src="{{ asset('logo.jpg') }}" alt="{{ config('app.name') }}"
                                    class="email-masthead_logo"
                                    style="border-radius: 50%; width: 64px; height: 64px; object-fit: cover;">
                            </a>
                            <div style="margin-top: 16px;">
                                <a href="{{ config('app.url') }}" class="email-masthead_name">
                                    DropMixr
                                </a>
                            </div>
                        </td>
                    </tr>
                </table>

                <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Body -->
                    <tr>
                        <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                            <table class="email-body_inner" align="center" width="100%" cellpadding="0" cellspacing="0"
                                role="presentation">
                                <tr>
                                    <td class="content-cell">
                                        @yield('content')
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table class="email-footer" align="center" width="100%" cellpadding="0" cellspacing="0"
                    role="presentation">
                    <tr>
                        <td align="center">
                            <p>
                                &copy; {{ date('Y') }} <strong>DropMixr</strong>. Hecho para DJs, por DJs.
                            </p>
                            <p>
                                <a href="{{ config('app.url') }}">Web</a>
                                •
                                <a href="#">Términos y Condiciones</a>
                                •
                                <a href="#">Privacidad</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>