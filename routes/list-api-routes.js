const express = require('express');

const ensureLoggedInApiVersion = require('../lib/ensure-logged-in-api');
const ListModel = require ('../models/list-model');
const CardModel = require ('../models/card-model');

const router = express.Router();

router.post('/api/lists', ensureLoggedInApiVersion, (req, res, next) => {
    ListModel
    .findOne({ owner: req.user._id })
    .sort({ position: -1 })
    .exec((err, lastList) => {
        if (err) {
            res.status(500).json({ message: 'Find list went to shittttemojii'});
            return;
        }
        let newPosition = 1;
        if (lastList){
            newPosition = lastList.position + 1;
        }
    const theList = new ListModel({
      title:        req.body.listTitle,
      position:     newPosition,
      owner:        req.user._id,

  });
    theList.save((err) => {
        if (err) {
            res.status(500).json({ message: 'list did not work'});
            return;
        }

        res.status(200).json(theList);
    });

    }); //close exec()

}); //close the post route '/api/lists'


router.get('/api/lists', ensureLoggedInApiVersion, (req, res, next) => {
    ListModel
    .find({ owner: req.user._id })
    .populate('cards')
    .exec((err, allTheLists) => {
      if (err) {
          res.status(500).json({ message: 'list find did not work'});
          return;
      }
        res.status(200).json(allTheLists);
    }); //close exec()
}); //close get '/api/lists'



module.exports = router;
