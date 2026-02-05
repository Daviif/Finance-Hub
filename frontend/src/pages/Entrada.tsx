// frontend/src/pages/Entrada.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ShieldCheck, PieChart, ArrowRight, LayoutDashboard, 
  CheckCircle, HelpCircle, ChevronDown 
} from 'lucide-react';
import '../styles/Entrada.css';

export default function Entrada() {
  return (
    <div className="entrada-container">
      
      {/* 1. Navbar */}
      <nav className="entrada-nav">
        <div className="nav-logo">
          <LayoutDashboard size={28} />
          <span>FinanceHub</span>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="btn-login">Entrar</Link>
          <Link to="/register" className="btn-register">Criar Conta</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">
          Domine suas finanças, <br />
          <span>conquiste seus sonhos.</span>
        </h1>
        <p className="hero-subtitle">
          A plataforma completa para quem quer sair do vermelho e começar a investir no futuro. 
          Simples, seguro e gratuito para começar.
        </p>
        <Link to="/register" className="hero-cta">
          Começar Agora <ArrowRight size={20} style={{marginLeft: '8px'}}/>
        </Link>
      </header>

      {/* 3. Benefícios (Features) */}
      <section className="features-section">
        <div style={{textAlign:'center', marginBottom: '3rem'}}>
          <h2 style={{fontSize:'2.2rem', marginBottom:'0.5rem', fontWeight:'800'}}>Tudo o que você precisa</h2>
          <p style={{color:'var(--text-gray)'}}>Ferramentas poderosas simplificadas para o seu dia a dia.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><PieChart size={28} /></div>
            <h3>Controle Total</h3>
            <p style={{color:'var(--text-gray)', lineHeight:1.6}}>Saiba exatamente para onde vai cada centavo com gráficos automáticos e categorias inteligentes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><TrendingUp size={28} /></div>
            <h3>Metas Reais</h3>
            <p style={{color:'var(--text-gray)', lineHeight:1.6}}>Defina objetivos como "Carro Novo" ou "Viagem" e o sistema te ajuda a calcular quanto economizar.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={28} /></div>
            <h3>Segurança Máxima</h3>
            <p style={{color:'var(--text-gray)', lineHeight:1.6}}>Seus dados são criptografados e protegidos. Apenas você tem acesso às suas informações financeiras.</p>
          </div>
        </div>
      </section>

      {/* 4. Como Funciona (Passo a Passo) */}
      <section className="steps-section">
        <h2 style={{fontSize:'2rem', fontWeight:'800', marginBottom:'1rem'}}>Comece em 3 passos</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">01</div>
            <div className="step-content">
              <h4>Crie sua conta</h4>
              <p>Cadastro rápido e gratuito. Em menos de 1 minuto você já tem acesso ao painel.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">02</div>
            <div className="step-content">
              <h4>Registre gastos</h4>
              <p>Adicione suas receitas e despesas. O sistema organiza tudo automaticamente.</p>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">03</div>
            <div className="step-content">
              <h4>Analise e Cresça</h4>
              <p>Veja os relatórios, corte gastos desnecessários e veja seu dinheiro render.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ (Dúvidas Frequentes) */}
      <section className="faq-section">
        <div style={{textAlign:'center', marginBottom: '3rem'}}>
          <h2 style={{fontSize:'2rem', fontWeight:'800'}}>Dúvidas Frequentes</h2>
        </div>

        <details className="faq-item">
          <summary className="faq-question">
            O FinanceHub é realmente gratuito? <ChevronDown size={20} color="#6B7280"/>
          </summary>
          <div className="faq-answer">
            Sim! Você pode criar sua conta e utilizar todas as funcionalidades principais de gestão financeira sem pagar nada.
          </div>
        </details>

        <details className="faq-item">
          <summary className="faq-question">
            Meus dados estão seguros? <ChevronDown size={20} color="#6B7280"/>
          </summary>
          <div className="faq-answer">
            Segurança é nossa prioridade. Utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros.
          </div>
        </details>

        <details className="faq-item">
          <summary className="faq-question">
            Posso acessar pelo celular? <ChevronDown size={20} color="#6B7280"/>
          </summary>
          <div className="faq-answer">
            Com certeza! O FinanceHub é totalmente responsivo e funciona perfeitamente no navegador do seu smartphone ou tablet.
          </div>
        </details>
      </section>

      {/* 6. Footer */}
      <footer className="entrada-footer">
        <div style={{marginBottom:'1.5rem'}}>
          <LayoutDashboard size={32} color="#10B981" style={{marginBottom:'10px'}}/>
          <h3 style={{color:'white', fontSize:'1.2rem'}}>FinanceHub</h3>
        </div>
        <p>&copy; 2026 FinanceHub. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}