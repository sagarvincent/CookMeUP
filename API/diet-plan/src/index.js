require('dotenv').config();

const express        = require('express');
const cors           = require('cors');
const dietPlanRoutes = require('./routes/dietPlanRoutes');
const macroRoutes    = require('./routes/macroRoutes');

const app  = express();
const PORT = process.env.PORT ?? 3004;

// ----------------------- middleware ------------------------------------- START
// called by: all routes
// ----------------------- middleware ------------------------------------- END
app.use(cors({
  origin:       process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  methods:      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ----------------------- routes ----------------------------------------- START
// ----------------------- routes ----------------------------------------- END
app.use('/diet-plan', dietPlanRoutes);
app.use('/users',     macroRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`[diet-plan] Listening on http://localhost:${PORT}`));
