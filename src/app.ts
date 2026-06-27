import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import alertRoutes from './routes/alert.routes';
import ipRoutes from './routes/ip.routes';
import healthRoutes from './routes/health.routes';
import { AppError } from './errors/app.error';
import { globalLimiter } from './middlewares/rate-limiter';
import { logger } from './config/logger';

// Load Swagger document dynamically
const swaggerPath = path.join(__dirname, '../docs/swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(globalLimiter);

// Swagger Documentation UI Route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use(healthRoutes); // Exposes GET /health
app.use('/api', alertRoutes); // Exposes GET /api/alerts and GET /api/alerts/top-targeted
app.use('/api', ipRoutes); // Exposes CRUD for /api/highlighted-ips and GET /api/alerts/monitoring

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.url}`,
  });
});

// Central Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // If the error is an instance of our operational AppError, return it format-compliant
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { errors: err.details } : {}),
    });
  }

  // Otherwise, treat it as an unexpected system/database failure (e.g. TypeError, connection error)
  logger.error({ err }, 'Unexpected error occurred');

  interface ErrorResponsePayload {
    success: boolean;
    message: string;
    error?: string;
    stack?: string;
  }

  const responsePayload: ErrorResponsePayload = {
    success: false,
    message: 'Internal Server Error',
  };

  // Include detailed error messages if in development mode
  if (process.env.NODE_ENV === 'development') {
    responsePayload.error = err.message || String(err);
    responsePayload.stack = err.stack;
  }

  return res.status(500).json(responsePayload);
});

export default app;
