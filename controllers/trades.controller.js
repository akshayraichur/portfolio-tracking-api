const TradesModule = require('../models/Trades');
const PortfolioModule = require('../models/Portfolio');
const SecuritiesModule = require('../models/Securities');
const AllTradesModule = require('../models/AllTrades');

exports.BuyShares = async (req, res, next) => {
	// As of now, we are not taking customer from the req.body, but later it can also be taken from req.body, that will be a better and accurate implementation. But since we already know there is only 1 customer so I am taking it directly from DB.
	const { ticker, quantity, avgPrice, tradeType } = req.body;

	if (quantity < 1) {
		return res.json({ err: 'Quantity cannot be less than 1.' });
	}

	// Check for ticker which is present in Securities or not.
	let checkSecurity;
	try {
		checkSecurity = await SecuritiesModule.findOne({ ticker });
	} catch (error) {
		return res.json({ error });
	}

	// If not present then error is thrown
	if (!checkSecurity) {
		return res.json({
			error: 'Please Buy Trades which are present in the Securities DB.',
		});
	}

	// Get Customer Details. (This can be directly taken from the request for better implementation)
	let customer;
	try {
		customer = await PortfolioModule.findOne({
			pan: 1234567,
			name: 'Akshay Raichur',
		});
	} catch (error) {
		return res.json({ error });
	}

	// If Customer not found then error is thrown.
	if (!customer) return res.json({ error: 'No such customer Present!' });

	// Find the company
	let findTicker;
	try {
		findTicker = await TradesModule.findOne({ ticker });
	} catch (error) {
		return res.json(error);
	}

	// If A user is buying the shares of the same company then it will be averaged and this is done inside this if() block.
	if (findTicker) {
		// Formula to calculate the avg price of the same share bought.
		findTicker.avgPrice =
			(findTicker.avgPrice * findTicker.quantity + avgPrice * quantity) /
			(findTicker.quantity + quantity);

		findTicker.quantity += quantity;

		await findTicker.save();

		// Saves the new trade in All Trades collection.
		let NewTrade = new AllTradesModule({
			ticker,
			quantity,
			avgPrice,
			tradeType,
			customer,
			// prevPrice: avgPrice,
			// tradeId: findTicker._id,
		});

		let saveNewTrade;
		try {
			saveNewTrade = await NewTrade.save();
		} catch (error) {
			return res.json({ error });
		}

		return res.json({
			Updated: 'Trades.',
			trade: findTicker,
			newTrade: saveNewTrade,
		});
	}
	// If the user is buying shares of a different company which he has never bought, then else is used.
	else {
		// Values are getting inserted into DB.
		let tradeValues = new TradesModule({
			ticker,
			quantity,
			avgPrice,
			customer,
		});

		let saveTrade;
		try {
			saveTrade = await tradeValues.save();
		} catch (error) {
			return res.json({ error });
		}

		// Saves the new trade in All Trades collection.
		let NewTrade = new AllTradesModule({
			ticker,
			quantity,
			avgPrice,
			tradeType,
			customer,
			// prevPrice: saveTrade.avgPrice,
			// tradeId: saveTrade._id,
		});

		let saveNewTrade;
		try {
			saveNewTrade = await NewTrade.save();
		} catch (error) {
			return res.json({ error });
		}

		return res.json({
			trade: saveTrade,
			newTrade: saveNewTrade,
		});
	}
};

exports.SellShares = async (req, res, next) => {
	const { ticker, quantity, avgPrice, tradeType } = req.body;

	if (quantity < 1) {
		return res.json({ err: 'Quantity cannot be in negative' });
	}

	// Check for ticker which is present in Securities or not.
	let checkSecurity;
	try {
		checkSecurity = await SecuritiesModule.findOne({ ticker });
	} catch (error) {
		return res.json({ error });
	}

	// If not present then error is thrown
	if (!checkSecurity) {
		return res.json({
			error: 'You can only BUY/SELL Shares which are listed in Securitites DB',
		});
	}

	// Get Customer Details. (This can be directly taken from the request for better implementation)
	let customer;
	try {
		customer = await PortfolioModule.findOne({
			pan: 1234567,
			name: 'Akshay Raichur',
		});
	} catch (error) {
		return res.json({ error });
	}

	// If Customer not found then error is thrown.
	if (!customer) return res.json({ error: 'No such customer Present!' });

	// Find the company
	let findTicker;
	try {
		findTicker = await TradesModule.findOne({ ticker });
	} catch (error) {
		return res.json(error);
	}

	// Checking if the user has bought those shares are not. If not then cant sell
	if (!findTicker) {
		return res.json({
			error: 'You cannot sell those shares which you havent bought.',
		});
	}

	// We need to check if the sell quantity is less than buy quantity or not.
	if (findTicker.quantity >= quantity) {
		// Allowed to SELL
		findTicker.quantity -= quantity;

		await findTicker.save();

		let newSellTrade = new AllTradesModule({
			customer,
			ticker,
			quantity,
			tradeType,
			avgPrice,
		});

		let saveNewTrade;
		try {
			newSellTrade = await newSellTrade.save();
		} catch (error) {
			return res.json({ error });
		}

		return res.json({ message: 'Sold', findTicker });
	} else {
		res.json({ error: 'You cannot sell more than what you have bought. ' });
	}
};

exports.FetchTrades = async (req, res, next) => {
	// To fetch all the trades from AllTrades
	let fetchTrades;
	try {
		fetchTrades = await AllTradesModule.find();
	} catch (error) {
		return res.json({ error });
	}

	if (!fetchTrades) {
		return res.json({ error: 'There are no trades to be fetched.' });
	}

	return res.json({ message: 'Fetched Successfully', fetchTrades });
};

exports.FetchPortfolio = async (req, res, next) => {
	// To fetch stocks which are present in Trades collection. Since there is only 1 user no verification is done.
	let fetchPortfolio;
	try {
		fetchPortfolio = await TradesModule.find();
	} catch (error) {
		return res.json(error);
	}

	if (!fetchPortfolio) {
		return res.json({ error: 'Your portfolio is empty' });
	}

	return res.json({
		message: 'Successfully Fetched Portfolio',
		fetchPortfolio,
	});
};

exports.DeleteTrade = async (req, res, next) => {
	const { id } = req.params;

	let deleteTrade;
	try {
		deleteTrade = await AllTradesModule.findOne({ _id: id });
	} catch (error) {
		return res.json({ error });
	}

	if (!deleteTrade) return res.json({ err: 'No Such Trade found' });

	// Deleting the trade

	let tradeType = deleteTrade.tradeType;
	let ticker = deleteTrade.ticker;

	let deleteT;
	try {
		deleteT = await AllTradesModule.findOneAndRemove({ _id: id });
	} catch (error) {
		return res.json({ error });
	}

	// Fetch all the trades of the same type.
	let getAllTrades;
	try {
		getAllTrades = await AllTradesModule.find({
			tradeType,
			ticker,
		});
	} catch (error) {
		return res.json({ error });
	}

	// getAllTrades will have all the values of that ticker and tradetype

	// TODO: create a new object like avg = {price: , quantity: } and store the first iteration of the array into this. then what I can do is, do something like in a loop, ( avg.price x avg.quantity + getAllTrades[i].avgPrice x getAllTrades[i].quantity ) / avg.quantity + getAllTrades[i].quantity and whatever the answer will be that will be stored in avg.price and avg.quantity will be updated by avg.quantity + quantity.

	let avg = {
		price: getAllTrades[0].avgPrice,
		quantity: getAllTrades[0].quantity,
	};
	for (let i = 1; i < getAllTrades.length; i++) {
		let ans =
			(avg.price * avg.quantity +
				getAllTrades[i].avgPrice * getAllTrades[i].quantity) /
			(avg.quantity + getAllTrades[i].quantity);

		avg.price = ans;
		avg.quantity = avg.quantity + getAllTrades[i].quantity;
	}

	// need to update the portfolio after calculation
	let getPortfolioTrade;
	try {
		getPortfolioTrade = await TradesModule.findOne({
			ticker: getAllTrades[0].ticker,
		});

		getPortfolioTrade.avgPrice = avg.price;
		getPortfolioTrade.quantity = avg.quantity;

		await getPortfolioTrade.save();
	} catch (error) {
		return res.json({ error });
	}

	return res.json({ updated: avg, portfolio: getPortfolioTrade });
};

exports.FetchReturns = async (req, res, next) => {
	// Gets all the stocks bought from the portfolio
	let portfolio;
	try {
		portfolio = await TradesModule.find();
	} catch (error) {
		return res.json({ error });
	}

	// If user has not added any stocks yet, then error is thrown
	if (!portfolio)
		return res.json({
			err:
				'You have not added any stocks to your portfolio, your returns are nil.',
		});

	let returns = 0;

	// Goes over a loop and calculates the returns
	// Since current price is mentioned to be taken as 100, thats why that constant value.
	for (let i = 0; i < portfolio.length; i++) {
		returns = returns + (100 - portfolio[i].avgPrice) * portfolio[i].quantity;
	}

	// Returns the response after the calculation.
	return res.json({ portfolio, returns: Math.abs(returns) });
};

exports.UpdateTrade = async (req, res, next) => {
	// Will Get the ID from params
	let { id } = req.params;
	// Gets the response from payload
	let { quantity, avgPrice, tradeType } = req.body;

	let findTrade;
	try {
		findTrade = await AllTradesModule.findById({ _id: id });
	} catch (error) {
		return res.json({ error, message: 'Please check the id string' });
	}

	// If the id of thr trade passed is wrong or someone enters the deleted id, then it throws an error.
	if (!findTrade)
		return res.json({
			err: 'There is no such trade found, please check id once again.',
		});

	// Simple method to update values. Get the row by id, then change/update the value.
	let updateTrade;
	try {
		updateTrade = await AllTradesModule.findById({ _id: id });
	} catch (error) {
		return res.json({ error });
	}

	if (quantity) updateTrade.quantity = quantity;

	if (avgPrice) updateTrade.avgPrice = avgPrice;

	if (tradeType) updateTrade.tradeType = tradeType;

	let saveTrade;
	try {
		saveTrade = await updateTrade.save();
	} catch (error) {
		return res.json({ error });
	}

	return res.json({ message: 'Updated Successfully', trade: saveTrade });
};
