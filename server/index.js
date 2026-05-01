import express from 'express';
import cors from 'cors';
import { scanRepository } from './routes/scan.js';
import rescueRouter from './routes/rescue.js';
import fixRouter from './routes/fix.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/scan', scanRepository);
app.use('/api/rescue', rescueRouter);
app.use('/api/fix', fixRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Repo Rescue Room API' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Repo Rescue Room server running on port ${PORT}`);
});

// Made with Bob
