
/*
 * GET home page.
 */
var request = require('request');
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.arduino = function(req, res){
  var currentTime = new Date();

  //console.log(req.params.id);
  //console.log(req.params.amp);

  var message = '[' +  currentTime + ']' + ' ' + 'ID:' + req.params.id + ' AMPS:' + req.params.amp;
  console.log(message);
  request('http://localhost:4000/arduino/' + req.params.id + '/' + req.params.amp, function(err, req, body){});
  request('http://localhost:5000/arduino/' + req.params.id + '/' + req.params.amp, function(err, req, body){});
  request('http://localhost:6000/arduino/' + req.params.id + '/' + req.params.amp, function(err, req, body){});

    res.render('index', { title: 'Express' })
};
