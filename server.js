/* ================================================
   JITPATEL WEB DEV — EXPRESS SERVER
   Node.js + Express + MySQL
   ================================================ */

'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const pool = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---- MIDDLEWARE ---- */

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    'http://localhost:5500',  // Live Server
    'http://127.0.0.1:5500',
    'null',  // file:// protocol
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiter — 20 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ---- DATABASE SETUP ---- */
async function initDatabase() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20),
        service VARCHAR(80),
        message TEXT NOT NULL,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new', 'read', 'replied') DEFAULT 'new'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅  Table "inquiries" ready.');
  } catch (err) {
    console.error('❌  Database init error:', err.message);
  }
}

/* ---- ROUTES ---- */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', message: 'Server is running', timestamp: new Date() });
});

// Contact form submission
app.post(
  '/api/contact',
  apiLimiter,
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required.')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required.')
      .isEmail().withMessage('Please provide a valid email address.')
      .normalizeEmail(),
    body('phone')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 20 }).withMessage('Phone too long.'),
    body('service')
      .optional({ checkFalsy: true })
      .trim()
      .isIn(['', 'web', 'uiux', 'backend', 'ecommerce', 'seo', 'other'])
      .withMessage('Invalid service selection.'),
    body('message')
      .trim()
      .notEmpty().withMessage('Message is required.')
      .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters.'),
  ],
  async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed.',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, phone, service, message } = req.body;
    const ip = req.ip || req.connection?.remoteAddress || null;

    try {
      const [result] = await pool.execute(
        `INSERT INTO inquiries (name, email, phone, service, message, ip_address)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone || null, service || null, message, ip]
      );

      console.log(`📩  New inquiry from ${name} <${email}> (ID: ${result.insertId})`);

      res.status(201).json({
        success: true,
        message: 'Thank you! Your inquiry has been received. Jit Patel will get back to you within 24 hours.',
        id: result.insertId,
      });
    } catch (err) {
      console.error('❌  Database insert error:', err.message);
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again or contact directly at +91 9687991925.',
      });
    }
  }
);

// Get all inquiries (admin — no auth for simplicity, add JWT in production)
app.get('/api/inquiries', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, service, message, status, created_at FROM inquiries ORDER BY created_at DESC'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// Update inquiry status
app.post('/api/inquiries/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['new', 'read', 'replied'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  try {
    await pool.execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

/* ---- START SERVER ---- */
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║   Jit Patel Web Dev — Backend API    ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║  Server: http://localhost:${PORT}       ║`);
    console.log(`║  Health: http://localhost:${PORT}/api/health ║`);
    console.log('╚══════════════════════════════════════╝');
    console.log('');
  });
}

startServer();

module.exports = app;
