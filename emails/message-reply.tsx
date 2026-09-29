import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type Props = {
  name: string;
  reply: string;
  original: string;
};

export function MessageReplyEmail({ name, reply, original }: Props) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Réponse à votre message</Preview>
      <Body style={{ backgroundColor: "#fafaf9", fontFamily: "sans-serif" }}>
        <Container
          style={{
            margin: "0 auto",
            padding: "32px 24px",
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
          }}
        >
          <Heading style={{ color: "#0c0a09", fontSize: "20px" }}>
            Bonjour {name},
          </Heading>
          <Text style={{ color: "#44403c", lineHeight: "1.6" }}>{reply}</Text>
          <Section
            style={{
              borderLeft: "3px solid #c98a4b",
              paddingLeft: "12px",
              marginTop: "24px",
            }}
          >
            <Text style={{ color: "#78716c", fontSize: "13px" }}>
              Votre message : {original.slice(0, 300)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
