import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
} from "@react-email/components";

interface InquiryNotificationProps {
  name: string;
  phone: string;
  email: string;
  message?: string;
  answers: Record<string, string>;
  photos: string[];
  preferredDate?: string;
}

export default function InquiryNotification({
  name,
  phone,
  email,
  message,
  answers,
  photos,
  preferredDate,
}: InquiryNotificationProps) {
  return (
    <Html lang="de">
      <Head />
      <Preview>Neue Anfrage von {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading as="h1" style={headerHeading}>
              Neue Anfrage
            </Heading>
            <Text style={headerSub}>von {name}</Text>
          </Section>

          {/* Contact info */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Kontaktdaten
            </Heading>
            <InfoRow label="Name" value={name} />
            <InfoRow label="Telefon" value={phone} />
            <InfoRow label="E-Mail" value={email} />
            {preferredDate && (
              <InfoRow label="Wunschtermin" value={preferredDate} />
            )}
            {message && <InfoRow label="Nachricht" value={message} />}
          </Section>

          <Hr style={divider} />

          {/* Answers */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Konfigurationsantworten
            </Heading>
            {Object.entries(answers).map(([key, value]) => (
              <InfoRow key={key} label={key} value={value} />
            ))}
          </Section>

          {/* Photos */}
          {photos.length > 0 && (
            <>
              <Hr style={divider} />
              <Section style={section}>
                <Heading as="h2" style={sectionTitle}>
                  Fotos ({photos.length})
                </Heading>
                {photos.map((url, index) => (
                  <Text key={url} style={photoLinkRow}>
                    <Link href={url} style={photoLink}>
                      Foto {index + 1} ansehen →
                    </Link>
                  </Text>
                ))}
              </Section>
            </>
          )}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese Nachricht wurde automatisch von Ihrer Website gesendet.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Helper component ────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Section style={infoRow}>
      <Text style={infoLabel}>{label}</Text>
      <Text style={infoValue}>{value}</Text>
    </Section>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#f0f0f0",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: "24px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  maxWidth: "600px",
  margin: "0 auto",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#2d5a27",
  padding: "28px 40px",
};

const headerHeading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 4px 0",
  lineHeight: "1.2",
};

const headerSub: React.CSSProperties = {
  color: "#b8dbb4",
  fontSize: "15px",
  margin: 0,
};

const section: React.CSSProperties = {
  padding: "20px 40px",
};

const sectionTitle: React.CSSProperties = {
  color: "#2d5a27",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  margin: "0 0 14px 0",
};

const divider: React.CSSProperties = {
  borderColor: "#e0e0e0",
  borderTopWidth: "1px",
  margin: "0 40px",
};

const infoRow: React.CSSProperties = {
  marginBottom: "8px",
};

const infoLabel: React.CSSProperties = {
  color: "#888888",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  margin: "0 0 1px 0",
};

const infoValue: React.CSSProperties = {
  color: "#1a1a1a",
  fontSize: "15px",
  margin: 0,
  lineHeight: "1.4",
};

const photoLinkRow: React.CSSProperties = {
  margin: "0 0 6px 0",
};

const photoLink: React.CSSProperties = {
  color: "#2d5a27",
  fontSize: "14px",
  textDecoration: "underline",
};

const footer: React.CSSProperties = {
  backgroundColor: "#f8f8f8",
  padding: "16px 40px",
  borderTop: "1px solid #e0e0e0",
};

const footerText: React.CSSProperties = {
  color: "#aaaaaa",
  fontSize: "12px",
  margin: 0,
};
