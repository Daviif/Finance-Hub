import React, { useState } from 'react';
import { MdArrowBack, MdEmail, MdLock } from 'react-icons/md'; // Biblioteca de ícones popular para web
import '../styles/Register.css'; // Importa o arquivo CSS

export default function RegisterScreen() {
  // const router = useRouter(); // Em React.js, você usaria 'useNavigate' da 'react-router-dom'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Erro: As senhas não coincidem.'); // 'alert' normal da web
      return;
    }
    if (!email || !password || !confirmPassword) {
      alert('Erro: Por favor, preencha todos os campos.'); // 'alert' normal da web
      return;
    }

    // Lógica de cadastro viria aqui.
    //alert('Sucesso', 'Conta criada com sucesso!');
    // router.push('/'); // Em React.js, você usaria navigate('/')
    window.location.href = '/'; // Jeito simples de voltar para a home
  };

  const handleGoBack = () => {
    // router.push('/');
    window.location.href = '/'; // Jeito simples de voltar para a home
  };

  return (
    // <SafeAreaView> vira <div>
    <div className="safeArea">
      {/* <View> vira <div> */}
      <div className="container">
        
        {/* <TouchableOpacity> vira <button> ou <div> com onClick */}
        <div className="backButton" onClick={handleGoBack}>
          <MdArrowBack size={24} color="#1d1d1dff" />
          <span className="backButtonText">Voltar pra o login</span>
        </div>

        {/* <Text> vira <h2> ou <p> */}
        <h2 className="title">Create your account</h2>

        {/* Campo de Email */}
        <label className="label" htmlFor="email">Email</label>
        <div className="inputContainer">
          <MdEmail size={20} color="#888" className="inputIcon" />
          {/* <TextInput> vira <input> */}
          <input
            id="email"
            className="input"
            type="email"
            placeholder="you@example.com"
            autoCapitalize="none"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Evento onChange é diferente
          />
        </div>

        {/* Campo de Senha */}
        <label className="label" htmlFor="password">Senha</label>
        <div className="inputContainer">
          <MdLock size={20} color="#888" className="inputIcon" />
          <input
            id="password"
            className="input"
            type="password" // 'secureTextEntry' vira 'type="password"'
            placeholder="Min. 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Campo de Confirmar Senha */}
        <label className="label" htmlFor="confirmPassword">Confirme a Senha</label>
        <div className="inputContainer">
          <MdLock size={20} color="#888" className="inputIcon" />
          <input
            id="confirmPassword"
            className="input"
            type="password"
            placeholder="Reescreva a Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* <TouchableOpacity> vira <button> */}
        <button className="createAccountButton" onClick={handleRegister}>
          <span className="createAccountButtonText">Criar Conta</span>
        </button>
      </div>
    </div>
  );
}