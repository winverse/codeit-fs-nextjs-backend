import { prisma } from '#db/prisma.js';

// TMDB ID로 영화 조회
function findByTmdbId(tmdbId) {
  return prisma.movie.findUnique({
    where: { tmdbId: Number(tmdbId) },
  });
}

// 영화 정보 저장 또는 업데이트
function upsert(movieData) {
  return prisma.movie.upsert({
    where: { tmdbId: movieData.id }, // TMDB ID 기준
    update: {
      title: movieData.title,
      overview: movieData.overview,
      posterPath: movieData.posterPath,
      releaseDate: movieData.releaseDate,
      voteAverage: movieData.voteAverage,
    },
    create: {
      tmdbId: movieData.id, // TMDB ID 저장
      title: movieData.title,
      overview: movieData.overview,
      posterPath: movieData.posterPath,
      releaseDate: movieData.releaseDate,
      voteAverage: movieData.voteAverage,
    },
  });
}

export const movieRepository = {
  findByTmdbId,
  upsert,
};
