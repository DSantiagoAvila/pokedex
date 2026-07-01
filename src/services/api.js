const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = 'Error en la solicitud';
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }
  return res.json();
}

// Auth

export async function apiRegister(username, email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
}

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// Users

export async function apiGetMe(token) {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function apiAddFavorite(token, pokemonId) {
  const res = await fetch(`${BASE_URL}/api/users/favorites/${pokemonId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function apiRemoveFavorite(token, pokemonId) {
  const res = await fetch(`${BASE_URL}/api/users/favorites/${pokemonId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

// Teams

export async function apiGetTeams(token) {
  const res = await fetch(`${BASE_URL}/api/teams`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function apiCreateTeam(token, name, members) {
  const res = await fetch(`${BASE_URL}/api/teams`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ name, members }),
  });
  return handleResponse(res);
}

export async function apiUpdateTeam(token, id, data) {
  const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDeleteTeam(token, id) {
  const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}
