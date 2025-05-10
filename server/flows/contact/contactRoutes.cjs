const express = require('express');
const { sendEmail } = require('./contactController.cjs');

const router = express.Router();

// POST /api/contact - Send contact email
router.post('/', sendEmail);

module.exports = router; 