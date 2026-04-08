import './config/loadEnv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import supplyChainRoutes from './routes/supplyChainRoutes';
import connectDB from './utils/db';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: true,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Useful request logs for debugging mobile networking issues.
app.use(morgan('dev'));

app.use(express.json({ limit: '1mb' }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/supply-chain', supplyChainRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend Running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Basic error handler for unexpected failures.
// (Routes/controllers should still handle expected errors with 4xx responses.)
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SDG7][Server] Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err instanceof Error ? err.message : String(err),
  });
});
