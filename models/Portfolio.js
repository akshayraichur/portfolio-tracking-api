const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolio = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		pan: {
			type: Number,
			unique: true,
			require: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolio);
