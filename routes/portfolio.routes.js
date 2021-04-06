const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Local Imports
const PortfolioController = require('../controllers/portfolio.controller');
const ValidationResult = require('../middlewares/validation');

const ValidationCheck = [
	check('name').notEmpty(),
	check('pan').isNumeric().notEmpty().isLength({ min: 7, max: 7 }),
];

// Add New Portfolio Profile
router.post(
	'/new',
	ValidationCheck,
	ValidationResult,
	PortfolioController.NewPortfolio
);

module.exports = router;
