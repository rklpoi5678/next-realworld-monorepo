import { cookieFetch } from './fetch-client';

export const userService = {
  getMe: () => cookieFetch('/api/user'),

  updateMe: (formData) =>
    cookieFetch('/api/user', {
      method: 'PATCH',
      body: formData,
    }),
};
