window.socket = io.connect('http://ks361513.kimsufi.com',{port:4000});
window.texto = '0';
enyo.kind({
    name: "Socketio",
    kind: enyo.Component,
    minInterval: 50,
    published: {
        baseInterval: 1000,
        percentTrigger: 50
    },
    events: {
        onTriggered: ""
    },
    create: function() {
        this.inherited(arguments);
        this.start();
    },
    destroy: function() {
        this.stopTimer();
        this.inherited(arguments);
    },
    start: function() {
       this.job = window.setInterval(enyo.bind(this, "timer"), this.baseInterval);
       socket.on('connect',function(){
            console.log('con');
          });
       socket.on('amps', function (data) {
            // console.log(Math.round(data.value*100));
            window.texto = Math.round(data.value*100);
        });
    },
    stop: function() {
        window.clearInterval(this.job);
    },
    timer: function() {
      this.doTriggered(texto);
    },
    baseIntervalChanged: function(inOldValue) {
        this.baseInterval = Math.max(this.minInterval, this.baseInterval);
        this.stop();
        this.start();
    }
});
