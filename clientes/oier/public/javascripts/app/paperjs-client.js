$(document).ready(function(){
    var ampList = [];
    paper.ampList = ampList;
    var lastValue = 0;
   var canvas = document.getElementById('paperMessages');
        // Create an empty project and a view for the canvas:
        paper.setup(canvas);
        paper.connected = false;
       
        var punto = new paper.Point(100, 100);
        // Move to start and draw a line from there
       
      
        
        var radius = 50;
        //var radius = 0;
        path = new paper.Path.Circle(punto, radius);
        path.strokeColor = 'black';
        path.fillColor = 'black';
        path.moveTo(punto);
        console.log(path.length);
        var text = new paper.PointText(punto);
        text.paragraphStyle.justification = 'center';
        text.characterStyle.fontSize = 20;
        text.fillColor = 'white';
        //console.log(paper);
//        _.bind('onFrame',function(event){});
      //    console.log(event);
       // });
        
        //paper.view.draw();
        paper.view.onFrame = function(event){
          //console.log('0');
          amp = paper.ampList.shift();
          //console.log(amp);
          if(ampList.length > 0)
            console.log(ampList.length);
          //if(amp !=== 'undefined'){
          if(paper.connected){
            //radius = 100 * 0.5
            //path = new paper.Path.Circle(punto, radius);
            //path.strokeColor = 'black';
            //path.fillColor = 'black';
            text.content = paper.ampList.length;
          }
          //}
          //$('#debugPaper').text(data.value);
        }
        
        // Draw the view now:
        //paper.view.draw();
        
     var socket = io.connect('http://ks361513.kimsufi.com',{port:5500});
     
     socket.on('connect',function(){
         console.log('con');
         paper.connected = true;
         $('body').append($('<div class="connected"></div>').text('Connected'));
         $('body').append($('<div id="debug"></div>'));
         $('body').append($('<div id="debugPaper"></div>'));
         //$('body').append($('<div id="message-container"></div>'));
      // });
       socket.on('amps', function (data) {
         //console.log(data.value);
        //console.log(ampList);
        paper.ampList.push(data.value);
        ampList.push(data.value);
        console.log(ampList);
        baseLength = 314.20333961477104;
        
        //path.scale(1 + data.value);
        var newValue = data.value;
        temp = newValue * 100 / lastValue;
       // path.scale(temp/100)
        var radius = 50;
        //var radius = 0;
        path = new paper.Path.Circle(punto, 50*newValue);
         path.fillColor = 'black';
        path.moveTo(punto);
        // $('#debug').text(data.value);
        $('#debug').text(temp);
         $('#message-container').prepend($('<div class="connected"></div>').text(data.message));
        lastValue = data.value;
        
       });
    });
  });