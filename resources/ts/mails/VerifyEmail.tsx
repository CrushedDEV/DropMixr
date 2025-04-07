import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

interface VerifyEmail {
  name?: string;
  url?: string;
}

export const VerifyEmail = ({
  name,
  url,
}: VerifyEmail) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Dropbox reset your password</Preview>
        <Container style={container}>
          <Img
            src="/public/logo.jpg"
            width="40"
            height="33"
            alt="DropMix"
          />
          <Section>
            <Text style={text}>Hola {name},</Text>
            <Text style={text}>
              ¡Bienvenido a <strong>DropMix</strong>!
              Antes de comenzar a explorar, compartir e intercambiar tus mejores mezclas, necesitamos verificar tu cuenta.
              Haz clic en el siguiente botón para activar tu perfil y empezar a conectar con otros mezcladores como tú:
            </Text>
            <Button style={button} href={url}>
              Verificar mi cuenta
            </Button>
            <Text style={text}>
              Si no creaste una cuenta en DropMix, puedes ignorar este mensaje sin problema.
            </Text>
            <Text style={text}>
              ¿Tienes dudas o necesitas ayuda? Visita nuestro
              <br />
              <Link style={anchor} href="https://dropmix.com/help">
                Centro de Ayuda
              </Link>
              .
            </Text>
            <Text style={text}>¡Nos vemos en la pista de mezcla! 🎶</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};
