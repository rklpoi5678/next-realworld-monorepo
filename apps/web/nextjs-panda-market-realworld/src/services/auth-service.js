import { cookieFetch, defaultFetch } from './fetch-client';

export const authService = {
  login: (email, password) =>
    cookieFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email, nickname, password, passwordConfirmation) =>
    defaultFetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ email, nickname, password, passwordConfirmation }),
    }),

  refreshToken: () =>
    cookieFetch('/api/refresh-token', {
      method: 'POST',
    }),
};
