import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  updateInterests: (userId, interests) => 
    api.put(`/auth/${userId}/interests`, { interests }),
};

// Feed API
export const feedAPI = {
  getPersonalizedFeed: (userId, page = 0, size = 10) =>
    api.get(`/feed/${userId}?page=${page}&size=${size}`),
  
  getTrending: (page = 0, size = 10) =>
    api.get(`/feed/trending?page=${page}&size=${size}`),
  
  getPopular: (page = 0, size = 10) =>
    api.get(`/feed/popular?page=${page}&size=${size}`),
  
  getLatest: (page = 0, size = 10) =>
    api.get(`/feed/latest?page=${page}&size=${size}`),
  
  getByCategory: (userId, category, page = 0, size = 10) =>
    api.get(`/feed/${userId}/category/${category}?page=${page}&size=${size}`),
  
  getArticle: (articleId) =>
    api.get(`/feed/article/${articleId}`),
};

// Interaction API
export const interactionAPI = {
  toggleLike: (userId, articleId) =>
    api.post('/interactions/like', { userId, articleId }),
  
  toggleBookmark: (userId, articleId) =>
    api.post('/interactions/bookmark', { userId, articleId }),
  
  shareArticle: (userId, articleId) =>
    api.post('/interactions/share', { userId, articleId }),
  
  recordView: (userId, articleId, readTimeSeconds) =>
    api.post('/interactions/view', { userId, articleId, readTimeSeconds }),
  
  getInteraction: (userId, articleId) =>
    api.get(`/interactions/${userId}/${articleId}`),
  
  getLikedArticles: (userId) =>
    api.get(`/interactions/${userId}/liked`),
  
  getBookmarkedArticles: (userId) =>
    api.get(`/interactions/${userId}/bookmarked`),
  
  getReadHistory: (userId) =>
    api.get(`/interactions/${userId}/history`),
};

// Test/Debug API
export const testAPI = {
  seedData: () => api.post('/test/seed-data'),
  fetchNews: () => api.get('/test/fetch-news'),
  getStats: () => api.get('/debug/stats'),
};

export default api;