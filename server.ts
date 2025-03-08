import 'rootpath';
import express, { Application } from 'express';
import cors from 'cors';
import errorHandler from './_middleware/error-handler';
import usersController from './users/users.controller';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/users', usersController);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT: number = process.env.NODE_ENV === 'production' ? Number(process.env.PORT) || 80 : 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
