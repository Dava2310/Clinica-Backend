// Importing necessary modules and configurations from config.js and red/responds.js files
import morgan from 'morgan';
import config from './config.js';
import express from "express";
import responds from './red/responds.js';
import cors from 'cors';

// Importing routes
import swaggerRouter from './swagger.js';
import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';

// Initialization of the app
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from different domains
app.use(cors());

// Error handling middleware

// Configure body parser
app.use(express.json());

// Configuration of the app
app.set('port', config.app.port);

// Middlewares
app.use(morgan('dev'));

// Including routes
app.use(userRoutes);
app.use(authRoutes);

// Main Route
app.get('/', (req, res) => {
    responds.success(req, res, {message: 'Hello World'}, 200);
});

// Swagger Documentation Route
app.use('/', swaggerRouter);

// Exporting the app so index.js can import it
export default app;