const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/erroMiddleware');

const app = express();

app.use(helmet());

// ✅ CORS permissif en dev : accepte localhost et 127.0.0.1 sur n'importe quel port
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman, curl, mobile

    // En dev : accepte tout localhost/127.0.0.1
    if (env.nodeEnv === 'development') {
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
    }

    // En prod : uniquement CLIENT_URL
    if (origin === env.clientUrl) {
      return callback(null, true);
    }

    console.warn(`🚫 CORS bloqué : ${origin}`);
    return callback(new Error('Non autorisé par CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get('/health', (_, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/v1', routes);

app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));
app.use(errorMiddleware);

module.exports = app;