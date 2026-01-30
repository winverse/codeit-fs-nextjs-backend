import express from 'express';
import { moviesRouter } from './movies.routes.js';

export const movieRouter = express.Router();

movieRouter.use('/', moviesRouter);
