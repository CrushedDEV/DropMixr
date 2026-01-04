import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';
import React from 'react';

interface ResetPasswordProps {
    url?: string;
}

export const ResetPassword = ({
    url = 'https://dropmixr.com/reset-password',
}: ResetPasswordProps) => {
    return (
        <Html>
            <Head />
            <Preview>Restablece tu contraseña de DropMixr</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: '#ec4899', // Pink-500
                                background: '#09090b', // Zinc-950
                                surface: '#18181b', // Zinc-900
                            },
                        },
                    },
                }}
            >
                <Body className="bg-background text-white font-sans">
                    <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-white/10 bg-surface p-[20px]">
                        <Section className="mt-[32px]">
                            <Heading className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 my-0 mx-auto p-0">
                                DropMixr
                            </Heading>
                        </Section>

                        <Section className="mt-[32px] text-center">
                            <Heading className="mx-0 my-[30px] p-0 text-[24px] font-normal text-white">
                                Solicitud de restablecimiento de contraseña
                            </Heading>

                            <Text className="text-[14px] leading-[24px] text-gray-300">
                                Hola,
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-gray-300">
                                Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>DropMixr</strong>.
                            </Text>

                            <Section className="mb-[32px] mt-[32px] text-center">
                                <Button
                                    className="rounded bg-gradient-to-r from-pink-600 to-purple-600 px-[20px] py-[12px] text-center text-[12px] font-semibold text-white no-underline shadow-lg hover:from-pink-500 hover:to-purple-500"
                                    href={url}
                                >
                                    Restablecer Contraseña
                                </Button>
                            </Section>

                            <Text className="text-[14px] leading-[24px] text-gray-300">
                                Este enlace expirará en 60 minutos.
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-gray-300">
                                Si no solicitaste un cambio de contraseña, no se requiere ninguna acción adicional.
                            </Text>

                            <Text className="text-[14px] leading-[24px] text-gray-400 mt-4">
                                Si tienes problemas con el botón, copia y pega este enlace:
                                <br />
                                <Link
                                    href={url}
                                    className="text-pink-500 no-underline underline"
                                >
                                    {url}
                                </Link>
                            </Text>
                        </Section>

                        <Section className="mt-[32px] border-t border-white/10 pt-[20px]">
                            <Text className="m-0 text-[12px] text-gray-500 text-center">
                                © {new Date().getFullYear()} DropMixr. Todos los derechos reservados.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ResetPassword;
