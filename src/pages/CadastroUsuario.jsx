import React, { useState, useEffect } from 'react'; // Importe useEffect
import api from '../services/api'; //
import { useNavigate } from 'react-router-dom';
import '../App.css'; //

function CadastroUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Efeito para limpar mensagens de erro/sucesso após um tempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000); // Limpa erro após 5 segundos
      return () => clearTimeout(timer);
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000); // Limpa sucesso após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [error, success]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // Validação básica de senha (exemplo)
  if (senha.length < 6) { // Ajuste conforme regras do back-end/schema
     setError('A senha deve ter pelo menos 6 caracteres.');
     return;
  }

  const dadosUsuario = {
     email,
     senha,
     ...(nome && { nome }) // Adiciona nome apenas se preenchido
  };

  try {
    const response = await api.post('/cliente', dadosUsuario); //
    setSuccess('Cadastro realizado com sucesso! Você será redirecionado para o login.');
    // Limpar formulário
    setNome('');
    setEmail('');
    setSenha('');
    // Redirecionar após um tempo
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Redireciona após 2 segundos
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);
    } else {
      setError('Erro ao realizar o cadastro. Tente novamente.');
    }
    console.error("Erro no cadastro:", err);
  }
};

return (
    <div className="container login-container"> {/* Reutilizando estilo do login */}
      <h2>Cadastro de Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome (opcional)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>} {/* Adicione estilo para .success-message em App.css se desejar */}
      <button type="button" onClick={() => navigate('/login')}>Voltar para Login</button> {/* Botão opcional para voltar */}
    </div>
  );
}

export default CadastroUsuario;