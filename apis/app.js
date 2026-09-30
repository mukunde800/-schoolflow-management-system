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
app.use(cors({ origin: env.clientUrl, credentials: true }));
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