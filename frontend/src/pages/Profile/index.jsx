import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import './style.css';

import api from '../../services/api';
import { clearSession, getOngName } from '../../services/auth';
import logoImg from '../../assets/logo.svg';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Profile() {
  const [, navigate] = useLocation();
  const [incidents, setIncidents] = useState([]);
  const ongName = getOngName();

  useEffect(() => {
    let active = true;

    api
      .get('/profile')
      .then((response) => {
        if (active) setIncidents(response.data);
      })
      .catch(() => {
        if (active) alert('Não foi possível carregar seus casos.');
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`/incidents/${id}`);

      setIncidents((current) => current.filter((incident) => incident.id !== id));
    } catch (err) {
      alert(err.response?.data?.error ?? 'Erro ao deletar o caso, tente novamente.');
    }
  }

  function handleLogout() {
    clearSession();
    navigate('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem-vinda, {ongName}</span>

        <Link className="button" href="/incidents/new">
          Cadastrar novo caso
        </Link>
        <button onClick={handleLogout} type="button" aria-label="Sair">
          <FiPower size={18} color="#E02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      {incidents.length === 0 ? (
        <p>Nenhum caso cadastrado ainda.</p>
      ) : (
        <ul>
          {incidents.map((incident) => (
            <li key={incident.id}>
              <strong>CASO:</strong>
              <p>{incident.title}</p>

              <strong>DESCRIÇÃO:</strong>
              <p>{incident.description}</p>

              <strong>VALOR:</strong>
              <p>{currency.format(incident.values)}</p>

              <button
                onClick={() => handleDeleteIncident(incident.id)}
                type="button"
                aria-label="Excluir caso"
              >
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
