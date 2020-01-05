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