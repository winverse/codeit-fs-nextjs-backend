import { config } from '#config';

const { TMDB_API_KEY, TMDB_BASE_URL } = config;

/**
 * TMDB API 요청 클라이언트
 * @param {string} endpoint - API 엔드포인트 (예: '/movie/popular')
 * @param {object} params - 쿼리 파라미터
 * @returns {Promise<object>} API 응답 JSON
 */
async function get(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'ko-KR');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API 요청 실패: ${response.status}`);
  }

  return response.json();
}

export const tmdbClient = {
  get,
};
