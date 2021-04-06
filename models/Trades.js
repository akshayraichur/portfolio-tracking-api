const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Trades = new Schema(
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
		avgPrice: {
			type: Number,
			min: 0,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Trades', Trades);
