import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import '../styles/AIChatbot.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

 
  const systemPrompt: Message = {
    role: 'system',
    content: `Você é o assistente virtual super inteligente do FinanceHub. 
    Seu objetivo é dar dicas financeiras curtas, diretas e práticas.
    Nunca dê respostas longas (máximo 3 parágrafos curtos).
    Seja amigável, use emojis e foque em economia, investimentos básicos e organização financeira.
    Se perguntarem algo fora de finanças, diga educadamente que seu foco é apenas o dinheiro do usuário.`
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou a IA do FinanceHub 💰. Como posso ajudar com suas finanças hoje?' }
  ]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
     
      const apiMessages = [systemPrompt, ...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', 
          messages: apiMessages,
          temperature: 0.7,
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const botReply = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);

    } catch (error) {
      console.error('Erro na IA:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um problema de conexão. Tente novamente! 🔌' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Botão Flutuante */}
      {!isOpen && (
        <button className="chatbot-trigger" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
        </button>
      )}

      {/* Janela do Chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={20} />
              <span>Finance IA</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="chatbot-close">
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role}`}>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-bubble typing">
                  <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo sobre finanças..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;