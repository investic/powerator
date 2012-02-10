var   twitter = require('ntwitter')
    , cradle = require('cradle')
    , db = new(cradle.Connection)('http://investic.iriscouch.com/', 5984, {
      cache: true,
      raw: false
  }).database('arduino');
      db.create();
    var twit = new twitter({
      consumer_key: 'eSYrfGq2idORMvj5BVCeEw',
      consumer_secret: 'HY0Oz2xUVIvVQH7exJCOURgPE9cOOnAuMZFs2Efv7Yw',
      access_token_key: '2176291-rtyAQHIHCFUMApeEV99pXe6FDz7bjX5g812FXETOGA',
      access_token_secret: 'jYRrQgcbKzO1n5XipVBL5s8GOTndM1wsOuZxyeQix8'
    });

    twit
      .verifyCredentials(function (err, data) {
        // console.log(console.dir(data));
      }).getUserTimeline({'screen_name':'patxangas','count': 2, 'include_entities': true}, function(err, data){
        /*
          var datos = [];
          for (var i = 0; i < data.length; i++) {
            var array_text = data[i].text.split(' ');
            var ids = data[i].id_str;
            
            datos.push({
                fecha: data[i].created_at,
                watios: !isNaN(array_text[2]) ? array_text[2] : 0,
                watioshora: !isNaN(array_text[4]) ? array_text[4] : 0
            })
          };
            var objeto = {datos: datos};
            db.save('arduino1', objeto, function (err, res) {
                if (err) {
                  console.log(err);
                } else {
                    // Handle success
                }
            });
          console.log(objeto);
          */
          console.log(data[0].text);
          console.log(data[0].entities);
      });
     

