
/*
 * GET home page.
 */

exports.arduino = function(req, res){
  console.log(req.params.valor);
  res.render('index', { title: 'Express' })
};
