import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Routes from '../src/routes';
import api from '../src/services/api';
import { saveSession } from '../src/services/auth';

vi.mock('../src/services/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

/** Monta a árvore de rotas em `path`, com histórico em memória. */
function renderAt(path) {
  const { hook, history } = memoryLocation({ path, record: true });

  render(
    <Router hook={hook}>
      <Routes />
    </Router>,
  );

  return { history, current: () => history[history.length - 1] };
}

const logged = () =>
  saveSession({ id: 'abcd1234', name: 'APAD', token: 'token-fake' });

beforeEach(() => {
  api.get.mockResolvedValue({ data: [] });
});

describe('Roteamento', () => {
  it('renderiza o Logon na raiz', () => {
    renderAt('/');

    expect(screen.getByRole('heading', { name: /faça seu logon/i })).toBeTruthy();
  });

  it('renderiza o cadastro em /register', () => {
    renderAt('/register');

    expect(screen.getByRole('heading', { name: /^cadastro$/i })).toBeTruthy();
  });

  it('redireciona rota desconhecida para o logon', () => {
    const { current } = renderAt('/rota-que-nao-existe');

    expect(current()).toBe('/');
    expect(screen.getByRole('heading', { name: /faça seu logon/i })).toBeTruthy();
  });

  it('navega para /register pelo link "Não tenho cadastro"', async () => {
    const user = userEvent.setup();
    const { current } = renderAt('/');

    await user.click(screen.getByRole('link', { name: /não tenho cadastro/i }));

    expect(current()).toBe('/register');
    expect(screen.getByRole('heading', { name: /^cadastro$/i })).toBeTruthy();
  });
});

describe('Rotas protegidas', () => {
  it('bloqueia /profile sem sessão', () => {
    const { current } = renderAt('/profile');

    expect(current()).toBe('/');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('bloqueia /incidents/new sem sessão', () => {
    const { current } = renderAt('/incidents/new');

    expect(current()).toBe('/');
  });

  it('libera /profile com sessão e carrega os casos', async () => {
    logged();
    api.get.mockResolvedValue({
      data: [
        { id: 1, title: 'Cadelinha', description: 'cirurgia', values: 120.5 },
      ],
    });

    renderAt('/profile');

    expect(await screen.findByText('Cadelinha')).toBeTruthy();
    expect(screen.getByText(/bem-vinda, apad/i)).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/profile');
  });

  it('formata o valor do caso em reais', async () => {
    logged();
    api.get.mockResolvedValue({
      data: [{ id: 1, title: 'Caso', description: 'desc', values: 120.5 }],
    });

    renderAt('/profile');

    const valor = await screen.findByText(/120,50/);
    expect(valor.textContent).toContain('R$');
  });
});

describe('Fluxo de login', () => {
  it('salva a sessão e leva para /profile', async () => {
    const user = userEvent.setup();
    api.post.mockResolvedValue({ data: { name: 'APAD', token: 'jwt-fake' } });

    const { current } = renderAt('/');

    await user.type(screen.getByPlaceholderText(/sua id/i), 'abcd1234');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => expect(current()).toBe('/profile'));

    expect(api.post).toHaveBeenCalledWith('/session', { id: 'abcd1234' });
    expect(localStorage.getItem('bth:token')).toBe('jwt-fake');
    expect(await screen.findByText(/bem-vinda, apad/i)).toBeTruthy();
  });

  it('mantém no logon quando a API recusa', async () => {
    const user = userEvent.setup();
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    api.post.mockRejectedValue({
      response: { status: 401, data: { error: 'Nenhuma ONG encontrada com este ID.' } },
    });

    const { current } = renderAt('/');

    await user.type(screen.getByPlaceholderText(/sua id/i), 'deadbeef');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(alerta).toHaveBeenCalledWith('Nenhuma ONG encontrada com este ID.'),
    );
    expect(current()).toBe('/');
    expect(localStorage.getItem('bth:token')).toBeNull();
  });
});
