import { prisma } from "#db/prisma.js";

// 특정 영화(TMDB ID 기준)의 리뷰 목록 조회
function findByMovieId(tmdbId) {
  return prisma.review.findMany({
    where: {
      movie: {
        tmdbId: Number(tmdbId),
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// 리뷰 생성
// 주의: data.movieId는 내부 Movie ID (ULID) 여야 함.
// 라우터에서 Movie를 조회/생성 후 그 ID를 넘겨줘야 함.
function create(data) {
  return prisma.review.create({
    data: {
      movieId: data.movieId, // ULID
      content: data.content,
      rating: data.rating,
      author: data.author,
    },
  });
}

// 리뷰 삭제
function remove(id) {
  return prisma.review.delete({
    where: { id },
  });
}

// 특정 리뷰 조회
function findById(id) {
  return prisma.review.findUnique({
    where: { id },
  });
}

export const reviewRepository = {
  findByMovieId,
  create,
  remove,
  findById,
};
