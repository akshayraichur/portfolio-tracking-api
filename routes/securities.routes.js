const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Local Imports
const Securities = require('../controllers/securities.controller');
const ValidationResult = require('../middlewares/validation');

// Validation Array for Add New Security
const ValidationCheck = [check('name').notEmpty(), check('ticker').notEmpty()];

// Add New Security : /securities/add
router.post(
	'/add',
	ValidationCheck,
	ValidationResult,
	Securities.AddSecurities
);

module.exports = router;
