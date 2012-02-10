
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.arduino = function(req, res){
  var currentTime = new Date();
  var message = '[' +  currentTime + ']' + ' ' + 'ID:' + req.params.id + ' AMPS:' + req.params.amp;
  console.log(message);
  res.json({'amps':req.params.amp});  
  //res.render('index', { title: 'Express' })
};
