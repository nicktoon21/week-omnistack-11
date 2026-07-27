import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FiArrowLeft } from 'react-icons/fi';

import './styles.css';

import api from '../../services/api';
import logoImg from '../../assets/logo.svg';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [loading, setLoading] = useState(false);

  const [, navigate] = useLocation();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/ongs', {
        name,
        email,
        whatsapp,
        city,
        uf,
      });

      alert(`Seu ID de acesso: ${response.data.id}`);
      navigate('/');
    } catch (err) {
      const details = err.response?.data?.details;

      alert(
        details?.map((d) => d.message).join('\n') ??
          err.response?.data?.error ??
          'Erro no cadastro, tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be The Hero" />

          <h1>Cadastro</h1>
          <p>
            Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem
            os casos da sua ONG
          </p>

          <Link className="back-link" href="/">
            <FiArrowLeft size={16} color="#e02041" />
            Voltar para o logon
          </Link>
        </section>

        <form onSubmit={handleRegister}>
          <input
            placeholder="Nome da ONG"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Whatsapp (só números, com DDD)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <div className="input-group">
            <input
              placeholder="Cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="UF"
              style={{ width: 80 }}
              maxLength={2}
              value={uf}
              onChange={(e) => setUf(e.target.value)}
            />
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
