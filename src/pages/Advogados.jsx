import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Advogados() {
  const [advogados, setAdvogados] = useState([]);
  const [nome, setNome] = useState('');
  const [oab, setOab] = useState(''); // OAB pode ser string para evitar problemas com zeros à esquerda
  const [especialidade, setEspecialidade] = useState('');
  const navigate = useNavigate();
  const [editando, setEditando] = useState(null); // Estado para controlar o advogado em edição

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // Usamos useCallback para memorizar a função e evitar que ela seja recriada em cada renderização.
  const fetchadvogados = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.get('/advogado');
      setAdvogados(response.data);
    } catch (error) {
      console.error("Erro ao buscar advogados:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  }, [navigate, handleLogout]);

  // Este useEffect agora executa apenas quando o componente é montado ou se a função fetchadvogados mudar.
  useEffect(() => {
    fetchadvogados();
  }, [fetchadvogados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const advogadoData = {
      nome,
      oab, // Enviando como string
      especialidade,
    };

    try {
      if (editando) {
        await api.put(`/advogado/${editando.id}`, advogadoData);
      } else {
        await api.post('/advogado', advogadoData);
      }
      fetchadvogados();
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar advogado:", error);
    }
  };

  const handleEdit = (advogado) => {
    setEditando(advogado);
    setNome(advogado.nome);
    setOab(advogado.oab);
    setEspecialidade(advogado.especialidade);
    };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este advogado?')) {
        try {
          await api.delete(`/advogado/${id}`);
          fetchadvogados(); // Recarrega a lista após a exclusão bem-sucedida
        } catch (error) {
          console.error("Erro ao deletar advogado:", error);
        }
    }
  };

  const resetForm = () => {
    setEditando(null);
    setNome('');
    setOab('');
    setEspecialidade('');
  };

  return (
    <div className="container">
      <button onClick={handleLogout} className="logout-button">Deslogar</button>
      <h2>Gerenciar Advogados</h2>
      
      <form onSubmit={handleSubmit}>
        <h3>{editando ? 'Editar advogado' : 'Novo Advogado'}</h3>
        <div className="form-grid">
            <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
            <input type="text" placeholder="OAB" value={oab} onChange={(e) => setOab(e.target.value)} required />
            <input type="text" placeholder="Especialidade" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} required />
        </div>
        <div className="form-actions">
            <button type="submit">{editando ? 'Atualizar' : 'Criar'}</button>
            {editando && <button type="button" className="btn-cancel" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      <h3>Lista de Advogados</h3>
      <ul className="adv-list">
        {advogados.map((advogado) => (
          <li key={advogado.id} className="adv-item">
            <span className="adv-info">
              {advogado.nome} (Oab: {advogado.oab}, Especialidade: {advogado.especialidade})
            </span>
            <div className="adv-actions">
                <button className="btn-edit" onClick={() => handleEdit(advogado)}>Editar</button>
                <button className="btn-delete" onClick={() => handleDelete(advogado.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Advogados;