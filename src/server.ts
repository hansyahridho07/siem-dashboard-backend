import 'reflect-metadata';
import app from './app';
import { initializeDatabase } from './config/db';
import { env } from './config/env';

const port = env.PORT;

// Initialize database first before starting the server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(port, () => {
      console.log(`========================================`);
      console.log(`  SIEM Backend Service is running!      `);
      console.log(`  Port: http://localhost:${port}          `);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`========================================`);
    });
  } catch (error) {
    console.error('Failed to start server due to database initialization failure:', error);
    process.exit(1);
  }
};

startServer();
