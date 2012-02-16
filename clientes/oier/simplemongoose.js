
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;


// Configuration


mongoose = mongoose.connect('mongodb://localhost/powerator');



var TimeEntry = new Schema({
  timestamp: Number
  ,amps: Number
});

var Arduino = new Schema({
  deviceId: String
, timeEntries: [TimeEntry] 
});

arduinoModel = mongoose.model('Arduino',Arduino);
timeEntryModel = mongoose.model('TimeEntry',TimeEntry);


console.log(timeEntryModel );


ampsMap = function(){
  console.log(this);
  emit(this.amps,this);
}
ampsReduce = function(previous,current){
var sum = 0;
return previous + current; 
}

command = {
  mapreduce:'arduinos',
  map:ampsMap,
  reduce:ampsReduce

}
mongoose.connection.db.executeDbCommand(command,function(err,dbRes){
  console.log(dbRes);
});
var tests = function (){
  var command = {
          mapreduce: "TimeEntry", //name of the collection we are map-reducing *note, this is the model Ping we defined above...mongoose automatically appends an 's' to the model name within mongoDB
          map: ampsMap.toString(), //a function we'll define next for mapping
          reduce: ampsReduce.toString(), //a function we'll define next for reducing
          sort: {amps: 1}, //let's sort descending...it makes the operation run faster
          out: "ampsjar" //the collection that will contain the map-reduce results *note, this must be a different collection than the map-reduce input
  };
  
    mongoose.connection.db.executeDbCommand(command,function(err,dbRes){
      console.log('err:');
      console.log(err);
      console.log('res');
     console.log(dbRes);
     } 
    );
    return '';
}

//tests();
