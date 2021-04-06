const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AllTrades = new Schema(
	{
		ticker: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		customer: {
			type: mongoose.Types.ObjectId,
			ref: 'Portfolio',
			required: true,
		},
		// prevPrice: {
		// 	type: Number,
		// 	min: 0,
		// 	required: true,
		// },
		avgPrice: {
			type: Number,
			min: 0,
			required: true,
		},
		tradeType: {
			type: String,
			required: true,
		},
		// tradeId: {
		// 	type: mongoose.Types.ObjectId,
		// 	required: true,
		// 	ref: 'Trades',
		// },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('AllTrades', AllTrades);
