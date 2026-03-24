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
  Preview,
} from "@react-email/components";

interface InquiryConfirmationProps {
  name: string;
  answers: Record<string, string>;
  preferredDate?: string;
}

export default function InquiryConfirmation({
  name,
  answers,
  preferredDate,
}: InquiryConfirmationProps) {
  return (
    <Html lang="de">
      <Head />
      <Preview>Ihre Anfrage ist eingegangen – wir melden uns innert 24 Stunden.</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading as="h1" style={headerHeading}>
              Ihre Anfrage ist eingegangen
            </Heading>
          </Section>

          {/* Greeting */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              Danke, {name}!
            </Heading>
            <Text style={paragraph}>
              Wir haben Ihre Anfrage erhalten und melden uns innert 24 Stunden.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Summary of answers */}
          <Section style={section}>
            <Heading as="h3" style={h3}>
              Ihre Angaben
            </Heading>
            {Object.entries(answers).map(([key, value]) => (
              <Section key={key} style={answerRow}>
                <Text style={answerKey}>{key}</Text>
                <Text style={answerValue}>{value}</Text>
              </Section>
            ))}
            {preferredDate && (
              <Section style={answerRow}>
                <Text style={answerKey}>Wunschtermin</Text>
                <Text style={answerValue}>{preferredDate}</Text>
              </Section>
            )}
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Bei Fragen stehen wir Ihnen gerne zur Verfügung.
            </Text>
            <Text style={footerText}>
              Mit freundlichen Grüssen
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#f5f0eb",
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
  backgroundColor: "#6b4f3a",
  padding: "32px 40px",
};

const headerHeading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700",
  margin: 0,
  lineHeight: "1.3",
};

const section: React.CSSProperties = {
  padding: "24px 40px",
};

const h2: React.CSSProperties = {
  color: "#3d2b1f",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const h3: React.CSSProperties = {
  color: "#6b4f3a",
  fontSize: "15px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 16px 0",
};

const paragraph: React.CSSProperties = {
  color: "#4a3728",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: "#e8ddd5",
  borderTopWidth: "1px",
  margin: "0 40px",
};

const answerRow: React.CSSProperties = {
  marginBottom: "10px",
};

const answerKey: React.CSSProperties = {
  color: "#8a6f5e",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  margin: "0 0 2px 0",
};

const answerValue: React.CSSProperties = {
  color: "#3d2b1f",
  fontSize: "15px",
  margin: 0,
};

const footer: React.CSSProperties = {
  backgroundColor: "#faf7f4",
  padding: "24px 40px",
};

const footerText: React.CSSProperties = {
  color: "#8a6f5e",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 0 4px 0",
};
