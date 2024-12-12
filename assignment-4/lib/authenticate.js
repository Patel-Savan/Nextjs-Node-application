import {jwtDecode} from 'jwt-decode';  // Correcting the import to the correct function from the 'jwt-decode' library

// Function to set the token in localStorage
export const setToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Function to get the token from localStorage
export const getToken = () => localStorage.getItem('auth_token');

// Function to remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

// Function to read the token from localStorage and decode it
export const readToken = () => {
  const token = getToken();
  if (token) return jwtDecode(token);  // Decode the token to access the payload
  return null;
};

// Function to check if the token is expired
export const isTokenExpired = (token) => {
  if (!token) return true; // If no token, consider it expired

  try {
    const decodedToken = jwtDecode(token);  // Decode the token
    const currentTime = Date.now() / 1000; // Get current time in seconds

    // Check if the token's expiration time is less than the current time
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Return true if there's an error (invalid token or decoding failed)
  }
};

// Function to check if the user is authenticated (i.e., token is valid and not expired)
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token); // Check if token exists and is not expired
};

// Function to authenticate the user
export const authenticateUser = async (userName, password) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  });

  if (!response.ok) throw new Error('Failed to authenticate');

  const { token } = await response.json();

  // Set the new token in localStorage
  setToken(token);
};

// Function to register the user
export const registerUser = async (userName, password, password2) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password, password2 }),
  });

  if (!response.ok) throw new Error('Failed to register');
};

// Function to check if the current token is expired before authenticating
export const checkAndAuthenticateUser = async (userName, password) => {
  const token = getToken();

  if (token && isTokenExpired(token)) {
    // If the token is expired, remove the expired token
    removeToken();
    throw new Error('Session expired. Please log in again.');
  }

  // Proceed with authentication if the token is valid or doesn't exist
  return await authenticateUser(userName, password);
};
