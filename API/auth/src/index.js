require('dotenv').config();

const express    = require('express');
const cors       = require('cors');

const authRoutes      = require('./routes/authRoutes');
const userRoutes      = require('./routes/userRoutes');
const bootstrapRoutes = require('./routes/bootstrapRoutes');

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ----------------------- middleware ------------------------------------- START
// calls:     express.json, cors
// called by: all routes
// ----------------------- middleware ------------------------------------- END
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ----------------------- routes ----------------------------------------- START
// called by: Express router dispatch
// ----------------------- routes ----------------------------------------- END
app.use('/auth',        authRoutes);
app.use('/users',       userRoutes);
app.use('/data/bootstrap', bootstrapRoutes);

// Health check — used by docker-compose and load balancers
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`[auth] Listening on http://localhost:${PORT}`);
});
