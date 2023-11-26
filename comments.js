// Create web server

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/comments');

// Create schema
var commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

// Create model
var Comment = mongoose.model('Comment', commentSchema);

// Create app
var app = express();

// Set up template engine
app.set('view engine', 'ejs');

// Set up static files
app.use(express.static('./public'));

// Set up body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Listen to port
app.listen(3000);
console.log('Listening to port 3000');

// Handle GET request
app.get('/', function(req, res) {
    Comment.find({}, function(err, data) {
        if (err) throw err;
        res.render('index', {comments: data});
    });
});

// Handle POST request
app.post('/', function(req, res) {
    var newComment = Comment(req.body).save(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});

// Handle DELETE request
app.delete('/:name', function(req, res) {
    Comment.find({name: req.params.name.replace(/\-/g, " ")}).remove(function(err, data) {
        if (err) throw err;
        res.json(data);
    });
});