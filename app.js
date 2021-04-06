const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Local Imports
const SecuritiesRoutes = require('./routes/securities.routes');
const PortfolioRoutes = require('./routes/portfolio.routes');
const TradeRoutes = require('./routes/trades.routes');

// Initial Config
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// API Routes Initialization
app.use('/securities', SecuritiesRoutes);
app.use('/portfolio', PortfolioRoutes);
app.use('/api', TradeRoutes);

let PORT = process.env.PORT || 4000;

// MongoDB Connection
mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
	() => console.log('DB Connected.')
);

app.listen(PORT, () => {
	console.log(`Server is listening on port ${process.env.PORT}`);
});
