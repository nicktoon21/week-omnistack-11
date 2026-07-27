import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FiLogIn } from 'react-icons/fi';

import './styles.css';

import api from '../../services/api';
import { saveSession } from '../../services/auth';

import logoImg from '../../assets/logo.svg';
import heroesImg from '../../assets/heroes.png';

export default function Logon() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/session', { id });

      saveSession({ id, name: response.data.name, token: response.data.token });
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.error ?? 'Falha no login, tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Be The Hero" />

        <form onSubmit={handleLogin}>
          <h1>Faça seu Logon</h1>

          <input
            placeholder="Sua ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <Link className="back-link" href="/register">
            <FiLogIn size={16} color="#e02041" />
            Não tenho cadastro
          </Link>
        </form>
      </section>

      <img src={heroesImg} alt="Heróis" />
    </div>
  );
}
