const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const policyRoutes = require('./routes/policyRoutes');
const claimRoutes = require('./routes/claimRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10kb' }));
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GigShield backend is running'
  });
});

module.exports = app;
