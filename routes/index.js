var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost:27017/test';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
/* var mongo = require('mongodb').MongoClient; */
/* var objectId = require('mongodb').ObjectID;
var assert = require('assert'); */

/* create a schema */
var userDataSchema = new Schema({
    title: { type: String, required: true },
    content: String,
    author: String
}, { collection: 'user-data' });

/* create Model */
var UserData = mongoose.model('UserData', userDataSchema);
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* get data */
router.get('/get-data', function(req, res, next) {
    /* getting data using Mongo */
    UserData.find().then(function(doc) {
        res.render('index', { items: doc });
    });
    /*     mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            var cursor = db.collection('user-data').find();
            cursor.forEach(function(doc, err) {
                assert.equal(null, err);
                resultArray.push(doc); 
            }, function() {
                db.close();
                res.render('index', { items: resultArray });
            });
        }); */
});

/* insert data */
router.post('/insert', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    var data = new UserData(item);
    data.save();

    /* mongo */
    /*     mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('user-data').insertOne(item, function(err, result) {
                assert.equal(null, err);
                console.log('Item Inserted');
                db.close();
            });
        }); */
    /* redirect to home */
    res.redirect('/');
});

/* update data */
router.post('/update', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    var id = req.body.id;
    UserData.findById(id, function(err, doc) {
        if (err) {
            console.error('error not found');
        }
        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.author = req.body.author;
        doc.save();
    });
    /* mongo */
    /*     mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('user-data').updateOne({ "_id": objectId(id) }, { $set: item }, function(err, result) {
                assert.equal(null, err);
                console.log('Item Updated');
                db.close();
            });
        }); */
    /* redirect to home */
    res.redirect('/');
});

/* delete data */
router.post('/delete', function(req, res, next) {
    var id = req.body.id;
    UserData.findByIdAndRemove(id).exec();
    /* redirect to home */
    res.redirect('/');
    /* mongo */
    /*  mongo.connect(url, function(err, db) {
         assert.equal(null, err);
         db.collection('user-data').deleteOne({ "_id": objectId(id) }, function(err, result) {
             assert.equal(null, err);
             console.log('Item Deleted');
             db.close();
         });
     }); */
});

module.exports = router;