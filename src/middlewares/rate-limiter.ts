import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../errors/app.error';
import { env } from '../config/env';

/**
 * General/Global Rate Limiter (applied globally to all endpoints).
 */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_GLOBAL_WINDOW_MS,
  max: env.DISABLE_RATE_LIMIT ? 999999 : env.RATE_LIMIT_GLOBAL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many requests. Please wait a moment before trying again.'));
  },
});

/**
 * Specific Rate Limiter for heavy search and aggregation queries (Task 1 and 2).
 */
export const heavyQueriesLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_HEAVY_WINDOW_MS,
  max: env.DISABLE_RATE_LIMIT ? 999999 : env.RATE_LIMIT_HEAVY_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many search requests. Please wait a minute before querying again.'));
  },
});

/**
 * Specific Rate Limiter for database modification (write) operations (Task 3 CRUD).
 */
export const writeOperationsLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WRITE_WINDOW_MS,
  max: env.DISABLE_RATE_LIMIT ? 999999 : env.RATE_LIMIT_WRITE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many modifications. Please wait a minute before making updates again.'));
  },
});
