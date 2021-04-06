const PortfolioModule = require('../models/Portfolio');

exports.NewPortfolio = async (req, res, next) => {
	const { name, pan } = req.body;

	// Check if User already exists or not.
	let checkUser;
	try {
		checkUser = await PortfolioModule.findOne({ pan });
	} catch (error) {
		return res.json({ error });
	}

	// If Present then throws an error
	if (checkUser)
		return res.json({
			error: 'PAN is already registered with us, please use a different one.',
		});

	// If not present then adds it into the DB
	let AddPortfolio = new PortfolioModule({
		name,
		pan,
	});

	let savePortfolio;
	try {
		savePortfolio = await AddPortfolio.save();
	} catch (error) {
		return res.json({ error });
	}

	return res.json({ message: 'Portfolio Added', data: savePortfolio });
};
