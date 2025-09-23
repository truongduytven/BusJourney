import createError from 'http-errors';
import express from 'express';
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import indexRouter from './routes/index';

// Import database connection
import knex from "./db";
import { initializeDatabase } from "./init";
import { checkDatabaseTables } from "./checkDb";

// --------------------- //

var app = express();
app.use(cors());
app.disable("etag");

app.locals.knex = knex;

// Initialize database on startup
const startDatabase = async () => {
  try {
    await initializeDatabase();
    await checkDatabaseTables();
  } catch (error) {
    console.error('Database startup failed:', error);
  }
};

startDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Express API",
      version: "1.0.0",
      description: "API documentation with Swagger UI",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/routes/*.ts", "src/controllers/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', indexRouter);

import { Request, Response, NextFunction } from "express";

app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: res.locals.error });
});

export default app;
