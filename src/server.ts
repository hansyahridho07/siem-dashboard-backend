import 'reflect-metadata';
import app from './app';
import { initializeDatabase } from './config/db';
import { env } from './config/env';

const port = env.PORT;

import { logger } from './config/logger';

// Initialize database first before starting the server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(port, () => {
      logger.info(`SIEM Backend Service is running on http://localhost:${port} (Env: ${process.env.NODE_ENV || 'development'})`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server due to database initialization failure');
    process.exit(1);
  }
};

startServer();
