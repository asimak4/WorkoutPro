import express from 'express';
import cors from 'cors';
import workoutRoutes from './routes/workoutRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', workoutRoutes);

export default app;
