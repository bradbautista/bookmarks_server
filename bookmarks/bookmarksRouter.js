const express = require('express');
const bookmarksRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../reSTORE')

//////////////////////////////////
//////////////////////////////////
////// ROUTE /bookmarks/ /////////
//////////////////////////////////
//////////////////////////////////

bookmarksRouter
  .route('/bookmarks')

  //////////////////////////////////
  ////////// GET /bookmarks ////////
  //////////////////////////////////  

  .get((req, res) => { 

    let response = bookmarks;

    // Filter our items by the query parameter if it is present
    if (req.query.param) {
        response = response.filter(item =>
        // Lowercase then compare to make search case-insensitive
        item.param.toLowerCase().includes(req.query.param.toLowerCase())
        )
    }

    // A filter with a numerical sort
    if (req.query.rating) {

    // Coerce query string to number to validate param
    let numberizedQueryString = parseFloat(req.query.rating)
    
    // If the value the user provided is not a number, is less than 0
    // or is bigger than 10, reject it. Also NaN is a number, so convert
    // numberizedQueryString back to a string and see if it evaluates to
    // 'NaN', since comparing to NaN doesn't seem to work
    if (typeof(numberizedQueryString) !== 'number' || numberizedQueryString.toString() === 'NaN' || numberizedQueryString < 0 || numberizedQueryString > 10) {
    return res
        .status(400)
        .send('Rating must be a number from 1 to 10, optionally with a single decimal value, i.e. 6.8.');
    }

    response = response
    // Filter the bookmarks for movies with a rating greater than or
    // equal to the value provided by the user
    .filter(movie => 
        movie.rating >= numberizedQueryString
    )
    // And then sort them using a comparison function
    .sort((a, b) => (a.rating > b.rating) ? 1 : (a.rating === b.rating) ? ((a.rating > b.rating) ? 1 : -1) : -1 )
    // And then put the bookmarks in descending order
    .reverse()
    }

    res.json(bookmarks)
  
  })

  //////////////////////////////////
  /////// POST /bookmarks //////////
  //////////////////////////////////

  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    
    if (!url) {
      logger.error(`Url is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!description) {
        logger.error(`Description is required`);
        return res
          .status(400)
          .send('Invalid data');
    }

    if (!rating) {
        logger.error(`Rating is required`);
        return res
          .status(400)
          .send('Invalid data');
    }

    // get an id
    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    };
  
    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);

    res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json({bookmark});
  })

//////////////////////////////////
//////////////////////////////////
////// ROUTE /bookmarks/:id //////
//////////////////////////////////
//////////////////////////////////

bookmarksRouter
  .route('/bookmarks/:id')

  //////////////////////////////////
  /////// GET /bookmarks/:id ///////
  //////////////////////////////////

  .get((req, res) => {

    const { id } = req.params;
    console.log(id);
    const bookmark = bookmarks.find(bookmark => bookmark.id == id);

    // make sure we found a bookmarks
    if (!bookmark) {
        logger.error(`bookmarks with id ${id} not found.`);
        return res
        .status(404)
        .send('bookmarks not found');
    }

    res.json(bookmark);

  })


  //////////////////////////////////
  ////// DELETE /bookmarks/:id /////
  //////////////////////////////////

  .delete((req, res) => {

    const { id } = req.params;
    const bookmarksIndex = bookmarks.findIndex(li => li.id == id);

    if (bookmarksIndex === -1) {
        logger.error(`bookmarks with id ${id} not found.`);
        return res
        .status(404)
        .send('Not Found');
    }

    bookmarks.splice(bookmarksIndex, 1);

    logger.info(`bookmarks with id ${id} deleted.`);
    res
        .status(204)
        .end();
  })

module.exports = bookmarksRouter;