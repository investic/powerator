$(document).ready(function(){
  var socket = io.connect('http://ks361513.kimsufi.com',{port:5000});
  socket.on('connect',function(){
        console.log('con');
      });
      socket.on('amps', function (data) {
        console.log(data.value);
        $('#message-container').prepend($('<div class="message"></div>').text(data.message));
      });
});