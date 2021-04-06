const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Securities = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		ticker: {
			type: String,
			unique: true,
			required: true,
		},
		currentPrice: {
			type: Number,
			default: 100,
		},
		// totalShares: {
		// 	type: Number,
		// 	default: 100,
		// },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Securities', Securities);
