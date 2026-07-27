const TOKEN_KEY = 'bth:token';
const ONG_ID_KEY = 'bth:ongId';
const ONG_NAME_KEY = 'bth:ongName';

export function saveSession({ id, name, token }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ONG_ID_KEY, id);
  localStorage.setItem(ONG_NAME_KEY, name);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ONG_ID_KEY);
  localStorage.removeItem(ONG_NAME_KEY);
}

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getOngName = () => localStorage.getItem(ONG_NAME_KEY);
export const isAuthenticated = () => Boolean(getToken());
