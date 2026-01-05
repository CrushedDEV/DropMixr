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
            line-height: 1.4;
            background-color: #000000;
            color: #e4e4e7;
            -webkit-text-size-adjust: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        a {
            color: #ec4899;
            text-decoration: none;
        }

        /* Layout */
        .email-wrapper {
            width: 100%;
            margin: 0;
            padding: 40px 0;
            background-color: #000000;
        }

        .email-content {
            width: 100%;
            max-width: 570px;
            margin: 0 auto;
            padding: 0;
        }

        /* Card */
        .email-body {
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #111111;
            border: 1px solid #27272a;
            border-radius: 12px;
            color: #e4e4e7;
        }

        .email-body_inner {
            width: 570px;
            margin: 0 auto;
            padding: 40px;
            box-sizing: border-box;
        }

        /* Header */
        .email-masthead {
            padding: 25px 0;
            text-align: center;
        }

        .email-masthead_name {
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            text-decoration: none;
            text-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
        }

        /* Components */
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            border-radius: 8px;
            padding: 12px 30px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
        }

        .button:hover {
            box-shadow: 0 6px 20px rgba(236, 72, 153, 0.5);
        }

        h1 {
            font-size: 24px;
            font-weight: bold;
            margin-top: 0;
            color: #ffffff;
            text-align: center;
        }

        p {
            margin-top: 0;
            color: #d4d4d8;
            font-size: 16px;
            line-height: 1.6em;
        }

        .sub {
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px solid #27272a;
        }

        .sub p {
            font-size: 13px;
            line-height: 1.4em;
            color: #71717a;
        }

        /* Multi-column features */
        .feature-grid {
            width: 100%;
            text-align: center;
            margin: 30px 0;
        }

        .icon-container {
            font-size: 40px;
            margin-bottom: 15px;
        }

        /* Footer */
        .email-footer {
            width: 570px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .email-footer p {
            color: #71717a;
            font-size: 12px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {

            .email-body_inner,
            .email-footer {
                width: 100% !important;
                padding: 20px !important;
            }
        }
    </style>
</head>

<body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <!-- Header -->
                    <tr>
                        <td class="email-masthead">
                            <a href="{{ url('/') }}" class="email-masthead_name">
                                DropMixr
                            </a>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                            <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                role="presentation">
                                <tr>
                                    <td class="content-cell">
                                        @yield('content')
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td>
                            <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                                role="presentation">
                                <tr>
                                    <td class="content-cell" align="center">
                                        <p class="sub center">
                                            &copy; {{ date('Y') }} DropMixr. Todos los derechos reservados.
                                            <br>Hecho para DJs, por DJs.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>