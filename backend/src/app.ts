import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { config } from '@/shared/config';
import { logger } from '@/shared/utils/logger';
import { errorHandler } from '@/shared/middleware/error-handler.middleware';
import { notFoundHandler } from '@/shared/middleware/not-found.middleware';
import { authRouter } from '@/modules/auth/infrastructure/routes/auth.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
if (config.swagger.enabled) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'LGU Information Management System API',
        version: '1.0.0',
        description: 'API for Local Government Unit Information Management System',
      },
      servers: [
        {
          url: `http://localhost:${config.server.port}/api/${config.api.version}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/modules/*/infrastructure/routes/*.ts'],
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use(`/api/${config.api.version}/auth`, authRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
