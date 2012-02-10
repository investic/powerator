
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
  /* , cradle = require('cradle'); */
  // , db = new(cradle.Connection)('investic.iriscouch.com', 5984, {
  //     cache: true,
  //     raw: false
  // }).database('arduino');
  // 
  // db.create();

//var events = require('events');
  
var app = module.exports = express.createServer();

// Configuration

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


io = require('socket.io').listen(app);
app.connected = false;
io.sockets.on('connection', function (socket) {
console.log('Connection');
app.connected = true;
  app.socket = socket;
});

app.io = io;

app.routeRealTimeViewer = function(req, res){
  res.render('viewer', { title: '' });
}
app.routeArduino  = function(req, res){
  var currentTime = new Date();
  var amps = req.params.amp;
  var message = '[' +  currentTime + ']' + ' ' + 'ID:' + req.params.id + ' AMPS:' + amps;
  if(app.connected)
    app.socket.emit('amps', { message: message, value: amps});
    // db.save({time: new Date().getTime(), amps: amps}, function(err, res){
    //   if(err){
    //     console.log(err);
    //   }else{
    //   
    //   }
    // });
  // console.log(message);
  res.render('index', { title: 'Express' });
}

app.get('/arduino/:id/:amp?', app.routeArduino);
app.get('/viewer',app.routeRealTimeViewer);

app.listen(4000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
