require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet')
const app = express();
const bookmarksRouter = require('./bookmarks/bookmarksRouter');

// Only turn this on if you want to generate new data,
// and then turn it off, since nodemon will loop infinitely
// generateNewData = require('./ObjectGenerator')
reSTORE = require('./reSTORE.json')

// set up morgan
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(express.json());
app.use(helmet());
app.use(cors());

// Validating the bearer token

app.use(function validateBearerToken(req, res, next) {

  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
      logger.error(`Unauthorized request to path: ${req.path}`);
      return res.status(401).json({error: 'Unauthorized request'})
  }

  // move to the next middleware
  next()

})

app.use(bookmarksRouter);

console.log(process.env.API_TOKEN)

//////////////////////////////////
//////////////////////////////////
////////// GET /  ////////////////
//////////////////////////////////
//////////////////////////////////

app.get('/', (req, res) => {
  res.send(reSTORE);
});

//////////////////////////////////
//////////////////////////////////
////////// POST /  ////////////////
//////////////////////////////////
//////////////////////////////////

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('A POST request');
});

//////////////////////////////////
///// EXPRESS ERROR HANDLING /////
//////////////////////////////////

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})
  
//////////////////////////////////
//// LISTEN ON SPECIFIED PORT ////
//////////////////////////////////

const PORT = process.env.PORT || 17043;

app.listen(PORT, () => {
    // console.log(reSTORE)
    console.log(`Server listening on port ${PORT}`);
});

// module.exports = server;