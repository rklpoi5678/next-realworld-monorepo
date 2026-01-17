import { cookieFetch, defaultFetch } from './fetch-client';

export const articleService = {
  getBestArticles: () =>
    defaultFetch(`/api/articles/best`, {
      next: { revalidate: 3600 },
    }),

  getArticles: (keyword, orderBy, page) =>
    defaultFetch(
      `/api/articles?limit=5&page=${page}&keyword=${keyword}&orderBy=${orderBy}`,
    ),

  getArticlesById: (id) => defaultFetch(`/api/articles/${id}`),

  createArticle: (formData) =>
    cookieFetch(`/api/articles`, {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  updateArticle: (id, formData) =>
    cookieFetch(`/api/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(formData),
    }),

  deleteArticle: (id) =>
    cookieFetch(`/api/articles/${id}`, {
      method: 'DELETE',
    }),
};
