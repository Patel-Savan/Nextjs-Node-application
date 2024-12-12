import { getToken } from './authenticate';

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed API call');
  return response.json();
};

export const addToFavourites = (id) =>
  fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/favourites/${id}`, {
    method: 'PUT',
  });

export const removeFromFavourites = (id) =>
  fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/favourites/${id}`, {
    method: 'DELETE',
  });

export const getFavourites = () =>
  fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/favourites`);

export const addToHistory = (id) =>
  fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history/${id}`, {
    method: 'PUT',
  });

export const removeFromHistory = (id) =>
  fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history/${id}`, {
    method: 'DELETE',
  });

export const getHistory = () =>
  fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/user/history`);
