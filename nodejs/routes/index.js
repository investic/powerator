
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.arduino = function(req, res){
  var currentTime = new Date();

  //console.log(req.params.id);
  //console.log(req.params.amp);

  var message = '[' +  currentTime + ']' + ' ' + 'ID:' + req.params.id + ' AMPS:' + req.params.amp;
  console.log(message);
  res.render('index', { title: 'Express' })
};
