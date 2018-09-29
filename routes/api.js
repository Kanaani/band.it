const express = require('express');
const router = express.Router();
const Band = require('../models/band.js')

router.get('/bands', function(req, res, next){
    console.log("hello");
    res.send({type:'GET'});
});

router.post('/bands', function(req, res, next){
    Band.create(req.body).then(function(band){
        res.send(band);
    });

});

router.delete('/bands/:id', function(req, res, next){
    res.send({type:'DELETE'});
});

module.exports = router;

