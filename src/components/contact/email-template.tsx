import { Body, Container, Head, Html, Markdown, Preview, Text } from '@react-email/components';
import { CSSProperties } from 'react';

interface ContactUsEmailProps {
  name: string;
  email: string;
  message: string;
}

export const ContactUsEmail = ({ name, email, message }: ContactUsEmailProps) => (
  <Html>
    <Head />
    <Preview>Thanks for contacting us {name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>We have received your message</Text>
        <Markdown
          markdownContainerStyles={{
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
          }}
        >
          {message}
        </Markdown>
        <Text style={paragraph}>We will get back to you as soon as possible at {email}.</Text>
      </Container>
    </Body>
  </Html>
);

const main: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: CSSProperties = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph: CSSProperties = {
  fontSize: '16px',
  lineHeight: '26px',
};
