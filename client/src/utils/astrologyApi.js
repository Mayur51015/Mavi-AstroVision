import api from './api';

/**
 * Centralized astrology API functions for the frontend.
 * All calls go through the Mavi-AstroVision backend, which proxies to CosmyDay.
 */

/**
 * Search for birth locations via the server-side proxy.
 * Returns array of { name, displayName, lat, lon, countryCode }.
 */
export async function searchBirthLocation(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await api.get('/chart/search-location', { params: { q: query } });
    return res.data.locations || [];
  } catch {
    return [];
  }
}

/**
 * Generate a birth chart for the current user.
 */
export async function generateBirthChart(birthDetailId) {
  const res = await api.post('/chart/generate', { birthDetailId });
  return res.data;
}

/**
 * Get the current user's primary birth chart.
 */
export async function getMyChart() {
  const res = await api.get('/chart/primary');
  return res.data;
}

/**
 * Get the signature Cosmic Life Map™ for the current user.
 */
export async function getCosmicLifeMap() {
  const res = await api.get('/chart/life-map');
  return res.data;
}

/**
 * Get personalized Daily Cosmic Guidance for the current user.
 */
export async function getDailyCosmicGuidance() {
  const res = await api.get('/chart/daily-guidance');
  return res.data;
}

/**
 * Get horoscope for a specific sign and period.
 */
export async function getHoroscope(sign, period = 'daily') {
  const res = await api.get(`/horoscope/${sign}/${period}`);
  return res.data;
}

/**
 * Get upcoming astrology events.
 */
export async function getUpcomingEvents(days = 30, minImportance = 40) {
  const res = await api.get('/events/upcoming', {
    params: { days, min_importance: minImportance },
  });
  return res.data;
}

/**
 * Get user favorites (saved horoscopes and charts)
 */
export async function getUserFavorites() {
  const res = await api.get('/users/favorites');
  return res.data;
}

/**
 * Toggle favorite item (type: 'horoscope' | 'chart')
 */
export async function toggleFavoriteItem(type, id) {
  const res = await api.post('/users/favorites/toggle', { type, id });
  return res.data;
}

/**
 * Get user calculation and reading history
 */
export async function getUserHistory() {
  const res = await api.get('/users/history');
  return res.data;
}

/**
 * Check AI Companion configuration status
 */
export async function getAiServiceStatus() {
  const res = await api.get('/ai/status');
  return res.data;
}

/**
 * Send question to AI Companion
 */
export async function sendAiMessage(message, history = []) {
  const res = await api.post('/ai/chat', { message, history });
  return res.data;
}

/**
 * Helper to download PDF reports directly
 */
export async function downloadReportPdf(endpoint, filename, body = null) {
  const res = body
    ? await api.post(endpoint, body, { responseType: 'blob' })
    : await api.get(endpoint, { responseType: 'blob' });

  const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
}
