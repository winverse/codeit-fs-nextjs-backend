import express from 'express';
import { tmdbService } from '#services';
import { movieRepository, reviewRepository } from '#repository';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares';
import { NotFoundException } from '#exceptions';
import {
  paginationQuerySchema,
  searchQuerySchema,
  movieIdParamSchema,
  createReviewSchema,
} from './movies.schema.js';

export const moviesRouter = express.Router();

moviesRouter.get(
  '/',
  validate('query', paginationQuerySchema),
  async (req, res, next) => {
    try {
      const { page } = req.query;
      const result = await tmdbService.getPopularMovies(page);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
);

moviesRouter.get(
  '/now-playing',
  validate('query', paginationQuerySchema),
  async (req, res, next) => {
    try {
      const { page } = req.query;
      const result = await tmdbService.getNowPlayingMovies(page);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
);

moviesRouter.get(
  '/search',
  validate('query', searchQuerySchema),
  async (req, res, next) => {
    try {
      const { q, page } = req.query;
      const result = await tmdbService.searchMovies(q, page);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  },
);

moviesRouter.get(
  '/:id',
  validate('params', movieIdParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params; // TMDB ID

      // TMDB에서 영화 상세 정보 가져오기
      const movieDetail = await tmdbService.getMovieDetail(id);

      // DB에 영화 정보 저장/업데이트 (리뷰 조회용, 이제 tmdbId 기준 upsert)
      await movieRepository.upsert(movieDetail);

      // DB에서 리뷰 조회 (TMDB ID로 조회하도록 repo 수정됨)
      const reviews = await reviewRepository.findByMovieId(id);

      res.status(HTTP_STATUS.OK).json({
        ...movieDetail,
        reviews,
      });
    } catch (error) {
      if (error.message?.includes('TMDB')) {
        return next(new NotFoundException(ERROR_MESSAGE.MOVIE_NOT_FOUND));
      }
      next(error);
    }
  },
);

moviesRouter.get(
  '/:id/reviews',
  validate('params', movieIdParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params; // TMDB ID
      const reviews = await reviewRepository.findByMovieId(id);
      res.status(HTTP_STATUS.OK).json({ reviews });
    } catch (error) {
      next(error);
    }
  },
);

moviesRouter.post(
  '/:id/reviews',
  validate('params', movieIdParamSchema),
  validate('body', createReviewSchema),
  async (req, res, next) => {
    try {
      const { id: tmdbId } = req.params;
      const { content, rating, author } = req.body;

      // 1. 영화가 DB에 있는지 확인 (TMDB ID로)
      let movie = await movieRepository.findByTmdbId(tmdbId);

      // 2. 없으면 TMDB에서 가져와서 저장 (Upsert는 객체를 반환)
      if (!movie) {
        const movieDetail = await tmdbService.getMovieDetail(tmdbId);
        movie = await movieRepository.upsert(movieDetail);
      }

      // 3. 리뷰 생성 (여기서는 Movie의 실제 PK인 ULID(movie.id)를 넘겨야 함)
      const review = await reviewRepository.create({
        movieId: movie.id, // ULID
        content,
        rating,
        author,
      });

      res.status(HTTP_STATUS.CREATED).json(review);
    } catch (error) {
      next(error);
    }
  },
);

moviesRouter.get(
  '/:id/recommendations',
  validate('params', movieIdParamSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const recommendations = await tmdbService.getRecommendations(id);
      res.status(HTTP_STATUS.OK).json({ movies: recommendations });
    } catch (error) {
      next(error);
    }
  },
);
