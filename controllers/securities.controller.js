// Local Imports
const SecurityModel = require('../models/Securities');

// POST /add/security : Add Securities
exports.AddSecurities = async (req, res, next) => {
	const { name, ticker, totalShares } = req.body;

	const newSecurity = new SecurityModel({
		name,
		ticker,
		totalShares,
	});

	// Checks if the values are already present in the db or not
	let checkSecurity;
	try {
		checkSecurity = await SecurityModel.findOne({ ticker });
	} catch (error) {
		return res.json({ error });
	}

	// If present throws an error
	if (checkSecurity)
		return res.json({
			error: 'You have already added this Security, Please try a different one',
		});

	// If Unique Security, then saves it in DB
	let addSecurity;
	try {
		addSecurity = await newSecurity.save();
	} catch (error) {
		return res.json({
			err: 'There was some technical problem',
			errCode: error,
		});
	}

	// Success Response
	return res.json({ message: 'Created Successfully', security: newSecurity });
};
