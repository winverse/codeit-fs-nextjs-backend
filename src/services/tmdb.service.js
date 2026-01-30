import { tmdbClient } from '../lib/tmdb.client.js';

// 영화 데이터 변환 (목록용)
function transformMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
  };
}

// 영화 데이터 변환 (상세용)
function transformMovieDetail(movie) {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdropPath: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    runtime: movie.runtime,
    genres: movie.genres,
    tagline: movie.tagline,
  };
}

// 인기 영화 목록 조회
async function getPopularMovies(page = 1) {
  const data = await tmdbClient.get('/movie/popular', { page });
  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

// 영화 검색
async function searchMovies(query, page = 1) {
  const data = await tmdbClient.get('/search/movie', { query, page });
  return {
    movies: data.results.map(transformMovie),
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

// 영화 상세 정보
async function getMovieDetail(id) {
  const data = await tmdbClient.get(`/movie/${id}`);
  return transformMovieDetail(data);
}

// 추천 영화
async function getRecommendations(id) {
  const data = await tmdbClient.get(`/movie/${id}/recommendations`);
  return data.results.map(transformMovie);
}

export const tmdbService = {
  getPopularMovies,
  searchMovies,
  getMovieDetail,
  getRecommendations,
};
