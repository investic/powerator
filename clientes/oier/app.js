
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
  var title;
  var max, result = 0;
  var sum = 0;
  var counter = 0;
  var Arduino = app.mongoose.model('Arduino');
  Arduino.findOne({ deviceId: req.params.id}, function (err, doc){
    if(typeof doc!=null){
      if(typeof doc.timeEntries ==null){
//        console.log(doc);
      }
    counter = 0;
    doc.timeEntries.forEach(function(value){
      sum = sum + value.amps;
      counter++;
    });
      result = sum/counter;
    var max = doc.timeEntries.reduce(function(previous,current){
      return (current.amps > previous.amps) ? current:previous;
    });
    var min = doc.timeEntries.reduce(function(previous,current){
      return (current.amps < previous.amps) ? current:previous;
    });
    var sum = doc.timeEntries.reduce(function(previous,current){
      return previous + current.amps;
    },0);
    
    var media = sum/doc.timeEntries.length;
    var result = {
      max: max.amps
      ,min: min.amps
      ,sum: sum
      ,media: media
      ,numEntradas:doc.timeEntries.length

    }
    res.json(result);
    } else {

     res.json('oOOOps,no entries for this arduino',404); 
    }
  });

}
app.routeArduino  = function(req, res){
  var updatePeriod = 60*60; //cada hora
  var currentTime = new Date().getTime();;

  var updatePeriod = 1;
  
  var amps = req.params.amp;
  var message = '[' +  currentTime + ']' + ' ' + 'ID:' + req.params.id + ' AMPS:' + amps;
/*  var differenceTime = currentTime - lastUpdateTime;

  if(differenceTime > updatePeriod){
    
  }*/
  var Arduino = app.mongoose.model('Arduino');
  // console.log(message);
  var TimeEntry = app.mongoose.model('TimeEntry');
  var timeEntry = new TimeEntry({timestamp:currentTime,amps:amps});
 //ar doc = new Arduino();
  
 //oc.deviceId = 'Arduino1';

//doc.save();
  
  // var newDoc = Arduino.find({deviceId: 'Arduino1'});
  // console.log(newDoc);
  // newDoc.timeEntries.push(timeEntry);
  // newDoc.save();
  Arduino.findOne({ deviceId: 'Arduino1'}, function (err, doc){
     if(err){
    } else {
      if(doc === null){

        var doc = new Arduino();
  
        doc.deviceId = 'Arduino1';
        doc.timeEntries = [timeEntry];
        doc.save();
      } else {

       doc.timeEntries.push(timeEntry);
       doc.save();
     }
    } 
  });
  //var entry = new app.mongoose.model('TimeEntry');
  //request('http://localhost:5500/arduino/' + req.params.id + '/' + req.params.amp, function(err, req, body){});
  
  res.render('index', { title: 'Express' });
}

app.get('/arduino/:id/:amp?', app.routeArduino);
app.get('/arduino-stats/:id',app.routeArduinoStats);

app.listen(5000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
