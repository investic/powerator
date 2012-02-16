
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , request = require('request');
var mongoose = require('mongoose');
//var events = require('events');
var Schema = mongoose.Schema;

var app = module.exports = express.createServer();

// Configuration


app.mongoose = mongoose.connect('mongodb://localhost/powerator');

app.schemas = {};

var TimeEntry = new Schema({
  timestamp: Number
  ,amps: Number
});

var Arduino = new Schema({
  deviceId: String
, timeEntries: [TimeEntry] 
});

app.mongoose.model('Arduino',Arduino);
app.mongoose.model('TimeEntry',TimeEntry);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.routeArduinoStats  = function(req, res){
ampsMap = function(){
  emit(this.amps);
}
ampsReduce = function(previous,current){
var sum = 0;
return previous + current; 
}

var command = {
        mapreduce: "timeEntries", //the name of the collection we are map-reducing *note, this is the model Ping we defined above...mongoose automatically appends an 's' to the model name within mongoDB
        map: ampsMap.toString(), //a function we'll define next for mapping
        reduce: ampsReduce.toString(), //a function we'll define next for reducing
        sort: {amps: 1}, //let's sort descending...it makes the operation run faster
        out: "ampsjar" //the collection that will contain the map-reduce results *note, this must be a different collection than the map-reduce input
};

  app.mongoose.connection.db.executeDbCommand(command,function(err,dbRes){
    console.log('err:');
    console.log(err);
    console.log('res');
console.log(dbRes);
   } 
  );
  res.json('no stats for' + req.params.id,404);
}

app.get('/arduino-stats/:id',app.routeArduinoStats);

app.listen(5500);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
