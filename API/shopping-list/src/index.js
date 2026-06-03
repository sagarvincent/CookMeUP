require('dotenv').config();

const express         = require('express');
const cors            = require('cors');
const shoppingRoutes  = require('./routes/shoppingRoutes');

const app  = express();
const PORT = process.env.PORT ?? 3005;

// ----------------------- middleware ------------------------------------- START
// called by: all routes
// ----------------------- middleware ------------------------------------- END
app.use(cors({
  origin:         process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  methods:        ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ----------------------- routes ----------------------------------------- START
// ----------------------- routes ----------------------------------------- END
app.use('/shopping-list', shoppingRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`[shopping-list] Listening on http://localhost:${PORT}`));
