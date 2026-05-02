import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scanRouter from './routes/scan.js';
import rescueRouter from './routes/rescue.js';
import fixRouter from './routes/fix.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scan', scanRouter);
app.use('/api/rescue', rescueRouter);
app.use('/api/fix', fixRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Repo Rescue Room Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Made with Bob
