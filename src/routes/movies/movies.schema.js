import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../../config/swagger.js';

extendZodWithOpenApi(z);

// --- Schemas ---

export const paginationQuerySchema = registry.register(
  'PaginationQuery',
  z.object({
    page: z.coerce
      .number()
      .min(1)
      .default(1)
      .openapi({ example: 1, description: '페이지 번호' }),
  }),
);

export const searchQuerySchema = registry.register(
  'SearchQuery',
  z.object({
    q: z
      .string()
      .min(1, '검색어를 입력해주세요.')
      .openapi({ example: 'avengers', description: '검색어' }),
    page: z.coerce
      .number()
      .min(1)
      .default(1)
      .openapi({ example: 1, description: '페이지 번호' }),
  }),
);

export const movieIdParamSchema = registry.register(
  'MovieIdParam',
  z.object({
    id: z.coerce
      .number()
      .int()
      .positive()
      .openapi({ example: 24428, description: '영화 ID (TMDB ID)' }),
  }),
);

export const createReviewSchema = registry.register(
  'CreateReview',
  z.object({
    content: z
      .string()
      .min(1, '리뷰 내용을 입력해주세요.')
      .max(1000)
      .openapi({
        example: '정말 재미있는 영화였어요!',
        description: '리뷰 내용',
      }),
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .openapi({ example: 5, description: '평점 (1-5)' }),
    author: z
      .string()
      .min(1, '작성자 이름을 입력해주세요.')
      .max(50)
      .openapi({ example: '김코딩', description: '작성자 이름' }),
  }),
);

const movieSchema = registry.register(
  'Movie',
  z.object({
    id: z.string(),
    tmdbId: z.number(),
    title: z.string(),
    overview: z.string().nullable(),
    posterPath: z.string().nullable(),
    releaseDate: z.string().nullable(),
    voteAverage: z.number().nullable(),
  }),
);

const reviewSchema = registry.register(
  'Review',
  z.object({
    id: z.string(),
    movieId: z.string(),
    content: z.string(),
    rating: z.number(),
    author: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
);

// --- Paths (Routes) ---

registry.registerPath({
  method: 'get',
  path: '/api/movies',
  summary: '인기 영화 목록 조회',
  tags: ['Movies'],
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: '인기 영화 목록',
      content: {
        'application/json': {
          schema: z.object({
            movies: z.array(movieSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/movies/now-playing',
  summary: '현재 상영중 영화 목록 조회',
  tags: ['Movies'],
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    200: {
      description: '현재 상영중 영화 목록',
      content: {
        'application/json': {
          schema: z.object({
            movies: z.array(movieSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/movies/search',
  summary: '영화 검색',
  tags: ['Movies'],
  request: {
    query: searchQuerySchema,
  },
  responses: {
    200: {
      description: '검색 결과',
      content: {
        'application/json': {
          schema: z.object({
            movies: z.array(movieSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/movies/{id}',
  summary: '영화 상세 정보 조회',
  tags: ['Movies'],
  request: {
    params: movieIdParamSchema,
  },
  responses: {
    200: {
      description: '영화 상세 정보 및 리뷰',
      content: {
        'application/json': {
          schema: movieSchema.extend({
            reviews: z.array(reviewSchema),
          }),
        },
      },
    },
    404: {
      description: '영화를 찾을 수 없음',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/movies/{id}/reviews',
  summary: '특정 영화의 리뷰 목록 조회',
  tags: ['Reviews'],
  request: {
    params: movieIdParamSchema,
  },
  responses: {
    200: {
      description: '리뷰 목록',
      content: {
        'application/json': {
          schema: z.object({
            reviews: z.array(reviewSchema),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/movies/{id}/reviews',
  summary: '리뷰 작성',
  tags: ['Reviews'],
  request: {
    params: movieIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: createReviewSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '리뷰 작성 성공',
      content: {
        'application/json': {
          schema: reviewSchema,
        },
      },
    },
    400: {
      description: '잘못된 요청',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/movies/{id}/recommendations',
  summary: '추천 영화 목록 조회',
  tags: ['Movies'],
  request: {
    params: movieIdParamSchema,
  },
  responses: {
    200: {
      description: '추천 영화 목록',
      content: {
        'application/json': {
          schema: z.object({
            movies: z.array(movieSchema),
          }),
        },
      },
    },
  },
});
