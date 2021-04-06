## Documentation :

### Folder Structure

- Controllers (directory)
  This directory contains all the business logic of the app.
- Routes (directory)
  This directory contains all the routes for the entire app
- Models (directory)
  This directory contains all the MongoDB Schema which will act as collections in MongoDB.
- app.js (file)
  This is the main file where in all the packages are defined, db connection is set up and the server connection is set up.

### Data Models

- #### Securities :

This schema contains all the companies listed and are availiable to trade. In read world scenario it acts like NSE/BSE wherein all the stocks get listed and we can trade only those stocks which are listed. Here for example, INFY is listed (or stored in securities collection) then we can trade INFY, if TCS is not stored in securities collection then it will throw an error saying we cannot trade those which are not in the securities collection.

##### The listed ones are : INFY, TCS, RELIANCE, TATAMOTORS, WIPRO, HCLTECH.

- #### Portfolio :

This schema contains the user information, right now there are only 2 feilds 1. name and 2. PAN Card. PAN Card is a unique feild.

- #### Trades :

This schema stores all the particular trades of a user, this in real world acts as a portfolio, wherein it stores all the information about each stock traded, like quantity, its average price. This also has another fieild called customer which is a referance object id from portfolio, so that if there are 2 or more traders then it would be helpful to distinguish between each customers trades.

- #### All Trades :

This schema stores all the trades that happen, no matter if its BUY/SELL or if it belongs to a different customer, it stores everything. Right now, this app is designed keeping in mind of only 1 user.

### Route Definations

##### Securities Routes :

- This contains one API which allows us to add more securities if needed. It has 2 mandatory fields to be sent, they are name and ticker.

##### Portfolio Routes :

- This also contains one API which allows us to add a user/customer. There are only 2 fields (as of now) 1. Name and 2. PAN Card, PAN Card must be unique for every user.

##### Trades Routes :

- This contains all the main functionalities of the app. It has BUY/SELL , Update Trade, Delete Trade, Fetch-trades, Fetch-Portfolio, Fetch-Returns APIs.

### API Definations :

##### /securities/add

- name, ticker should be sent to req.body as payload.
- ticker is a unique attribute, you cannot add same ticker for 2 securities, it will throw an error.

##### /portfolio/new

- name, pan card shoule be sent to req.body as payload.
- pan card should contain min : 7 and max : 7 chars in it (exactly 7 chars), else it will throw an error.
- pan card is a unique attribute.

##### /api/buy

- ticker, quantity, avgPrice, tradeType must be sent to req.body as payload.
- You cannot skip any of the above.
- avgPrice cannot be negative value, least value is 1.
- quantity cannot be negative value, least value is 1.

##### /api/sell

- ticker, quantity, avgPrice, tradeType must be sent to req.body as payload.
- You cannot skip any of the above.
- avgPrice cannot be negative value, least value is 1.
- quantity cannot be negative value, least value is 1.
- You cannot sell more than what you have bought. If INFY quantity is 100, then you can sell 100 or below, not 101.
- This app is not designed for the concept of short selling.

##### /api/fetch-returns

- Returns the overall profit/loss in the portfolio.
- This is calculated using the formula.

##### /api/fetch-trades

- Returns all the Trades that have taken in place, no matter BUY/SELL, everything is listed in here.

##### /api/fetch-portfolio

- Returns stocks which are in portflio, this is the cummulative result of all the trades taken place.
- It will give out the total quantity of a particular stock bought, along with its avg price and the customer details attached to it.
- Right now this app is designed only for one single user, so it directly gives out the details only w.r.t that user.

##### /api/update-trade/:id

- Here we need to pass the object id as a parameter. It should be of the trade that we want to edit.
- Passing a fake id or irrelevent id will result in an error message displayed.
- You cannot skip passing an id.
- This API will update all the fields

##### /api/delete-trade/:id

- Here we need to pass the object id as a parameter. It should be of the trade that we want to delete.
- Passing a fake id or irrelevent id will result in an error message displayed.
- After deletion all the values will be reverted as it were, before adding this particular trade.
