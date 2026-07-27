import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FiArrowLeft } from 'react-icons/fi';

import './style.css';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

export default function NewIncident() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [values, setValues] = useState('');
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  async function handleNewIncident(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/incidents', { title, description, values });

      navigate('/profile');
    } catch (err) {
      const details = err.response?.data?.details;

      alert(
        details?.map((d) => d.message).join('\n') ??
          err.response?.data?.error ??
          'Erro ao cadastrar caso. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />

          <h1>Cadastrar novo caso</h1>
          <p>
            Descreva o caso detalhadamente para encontrar um herói para resolver
            isso.
          </p>

          <Link className="back-link" href="/profile">
            <FiArrowLeft size={16} color="#e02041" />
            Voltar para o home
          </Link>
        </section>

        <form onSubmit={handleNewIncident}>
          <input
            placeholder="Título do caso"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Valor em reais"
            value={values}
            onChange={(e) => setValues(e.target.value)}
          />

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
