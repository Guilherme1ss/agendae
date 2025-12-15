"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      {/* Navbar Simples */}
      <nav style={styles.nav}>
        <div style={styles.logo}>Agendaê</div>
        {/* Adicionei styles.navLinks aqui */}
        <div style={styles.navLinks}>
          <Link href="/login" style={styles.loginBtn}>
            Entrar
          </Link>
          <Link href="/register" style={styles.loginBtn}>
            Registrar
          </Link>
        </div>
      </nav>

      <main style={styles.hero}>
        <h1 style={styles.title}>Seu negócio com agenda aberta 24h por dia.</h1>
        <p style={styles.subtitle}>
          Crie seu perfil personalizado, envie o link para seus clientes e
          receba agendamentos automaticamente.
        </p>

        <div style={styles.ctaGroup}>
          <Link href="/cadastro" style={styles.primaryBtn}>
            Criar minha agenda grátis
          </Link>
          <p style={styles.demoText}>
            Ou veja um exemplo de{" "}
            <Link href="/booking/teste-agora" style={styles.link}>
              perfil de agendamento
            </Link>
          </p>
        </div>
      </main>

      <section style={styles.features}>
        <div style={styles.featureCard}>
          <div style={styles.icon}>🔗</div>
          <h3>
            <b>Link no Personalizado</b>
          </h3>
          <p>
            Coloque seu link personalizado na bio e deixe seus clientes
            agendarem sem você precisar parar o que está fazendo.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.icon}>🚫</div>
          <h3>
            <b>Adeus, Conflitos</b>
          </h3>
          <p>
            O sistema só mostra horários que você realmente tem livres. Sem
            agendamentos duplicados ou confusão no WhatsApp.
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.icon}>📱</div>
          <h3>
            <b>Agenda na sua Mão</b>
          </h3>
          <p>
            Acesse sua lista de clientes e horários de qualquer lugar, pelo
            celular ou computador, com segurança total.
          </p>
        </div>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    fontFamily: "sans-serif",
    background: "#fff",
    color: "#111",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 5%",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },
  // NOVO: Contêiner dos links da navbar
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px", // Isso cria o espaço horizontal entre eles
  },

  loginBtn: {
    textDecoration: "none",
    color: "#4f46e5",
    fontWeight: 600,
    fontSize: "15px", // Ajuste opcional de tamanho
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#4f46e5",
  },
  hero: {
    textAlign: "center",
    padding: "80px 10%",
    background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
  },
  title: {
    fontSize: "48px",
    fontWeight: 800,
    marginBottom: "20px",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: "18px",
    color: "#4b5563",
    maxWidth: "600px",
    margin: "0 auto 40px",
  },
  ctaGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  primaryBtn: {
    padding: "16px 32px",
    background: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "18px",
    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
  },
  demoText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#4f46e5",
    fontWeight: 600,
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "60px 5%",
  },
  featureCard: {
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
    textAlign: "center",
  },
};
