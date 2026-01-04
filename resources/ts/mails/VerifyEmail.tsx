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

interface VerifyEmailProps {
  name?: string;
  url?: string;
}

export const VerifyEmail = ({
  name = 'DJ',
  url = 'https://dropmixr.com/verify-email',
}: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a DropMixr - Verifica tu cuenta</Preview>
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
              {/* Logo or Brand Name */}
              <Heading className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 my-0 mx-auto p-0">
                DropMixr
              </Heading>
            </Section>

            <Section className="mt-[32px] text-center">
              <Heading className="mx-0 my-[30px] p-0 text-[24px] font-normal text-white">
                Verifica tu cuenta y empieza a mezclar
              </Heading>

              <Text className="text-[14px] leading-[24px] text-gray-300">
                Hola <strong>{name}</strong>,
              </Text>
              <Text className="text-[14px] leading-[24px] text-gray-300">
                ¡Bienvenido a <strong>DropMixr</strong>! Estamos emocionados de tenerte en la comunidad de DJs y productores más vibrante.
              </Text>
              <Text className="text-[14px] leading-[24px] text-gray-300">
                Para comenzar a explorar mashups exclusivos, subir tus creaciones y ganar créditos, por favor verifica tu dirección de correo electrónico.
              </Text>

              <Section className="mb-[32px] mt-[32px] text-center">
                <Button
                  className="rounded bg-gradient-to-r from-pink-600 to-purple-600 px-[20px] py-[12px] text-center text-[12px] font-semibold text-white no-underline shadow-lg hover:from-pink-500 hover:to-purple-500"
                  href={url}
                >
                  Verificar Correo Electrónico
                </Button>
              </Section>

              <Text className="text-[14px] leading-[24px] text-gray-400">
                o copia y pega este enlace en tu navegador:
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
                Si no creaste una cuenta en DropMixr, puedes ignorar este correo.
              </Text>
              <Text className="m-0 mt-2 text-[12px] text-gray-500 text-center">
                © {new Date().getFullYear()} DropMixr. Todos los derechos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
