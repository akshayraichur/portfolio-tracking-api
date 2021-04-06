const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

// Local Imports
const TradesController = require('../controllers/trades.controller');
const ValidationResult = require('../middlewares/validation');

// Validation check for Buy/Sell API
const ValidationCheck = [
	check('ticker').notEmpty(),
	check('quantity').isNumeric().isLength({ min: 1 }).notEmpty(),
	check('avgPrice').isNumeric().isLength({ min: 1 }).notEmpty(),
	check('tradeType').notEmpty(),
];

// Buy Shares API
router.post(
	'/buy',
	ValidationCheck,
	ValidationResult,
	TradesController.BuyShares
);
// Sell Shares API
router.post(
	'/sell',
	ValidationCheck,
	ValidationResult,
	TradesController.SellShares
);

// Fetch All the Trades API
router.get('/fetch-trades', TradesController.FetchTrades);

// Fetch Portfolio : Gives out the total shares, its worth.
router.get('/fetch-portfolio', TradesController.FetchPortfolio);

// Delete's a trade
router.delete('/delete-trade/:id', TradesController.DeleteTrade);

// Fetch returns : the profit earned.
router.get('/fetch-returns', TradesController.FetchReturns);

// Updates the trade.
router.patch('/update-trade/:id', TradesController.UpdateTrade);

module.exports = router;
