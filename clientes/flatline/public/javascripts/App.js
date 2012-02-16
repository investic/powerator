enyo.kind({
	name:"App",
	kind:"Control",
	components: [
    {name: "cabecera", classes:"super", style: "width: 502px; background-color:#000", components: [
      {tag: "span", name:" Amperios: ", content:"Amperios : ", style: "color: #fff"},
      {tag: "span", name:"fps", content:"", style: "color:#fff"},
      {tag: "span", name:" Watios: ", content:" Watios : ", style: "color: #fff"},
      {tag: "span", name:"wts", content:"", style: "color:#fff"}
    ]},
		{kind:"Canvas", style: "border: 1px solid black;", attributes: {width: 500, height: 500}, components: [
      {name: "timer", kind: "Socketio", percentTrigger: 66, onTriggered: "timerTriggered"},
			// a container for the balls
			{name: "ballpit", kind: "canvas.Control"},
			// a visible shelf to bounce off of
			{kind: "canvas.Rectangle", bounds: {l: 0, t: 490, w: 500, h: 0}},
			// an FPS counter
			{name:"amp", kind: "canvas.Text", bounds: {l: 0, t: 500}, color: "black"},
			{name:"supamp", kind: "canvas.Text", bounds: {l: 0, t: 20}, color: "black"}
		]},
		{tag: "br"},
		// Reset the balls / change the number
		// {tag: "button", content: "Reset", ontap: "reset"},
		// {tag: "br"},
		// {tag: "span", content:"Balls: "},
		// {tag: "input", name: "balls", attributes: {value: "10", placeholder: "Number of Balls"}}
	],
  timerTriggered: function(inSender, inTime) {
     // this.log(this.getBalls());
      this.$.amp.setText('0');
      this.$.supamp.setText('1');
      var todos = [];
      if(this.$.ballpit.children.length <= 2){
        var bucle = this.$.ballpit.children.length;
        this.$.fps.setContent(inTime/100);
        this.$.wts.setContent((inTime/100)*220);
        // this.$.fpsCounter.setText(inTime);
        var colors = [ "green", "blue", "black", "brown", "red", "orange"];
        bounce = (enyo.irand(69) + 30) / 100;
        color = colors[enyo.irand(colors.length)];
        t = enyo.irand(375);
        l = 10 + (enyo.irand(49) * 10);
        // this.$.ballpit.createComponent({kind: "canvas.Circle", bounds: {l: l, t: t, w: inTime}, color: 'rgba('+inTime+',14,'+enyo.irand(inTime*8)+', .5)', bounce: bounce, vel: 0, owner: this});
        this.$.ballpit.createComponent({kind: "canvas.Rectangle", bounds: {l:bucle*24 , t: 500, w:20, h:-inTime*5}, color: 'rgba('+inTime+',14,'+enyo.irand(inTime*8)+', 9)', bounce: bounce, vel: 0, owner: this});
      }else{
        var barra =  this.$.ballpit;
        // console.log(barra);
		     this.setupBalls(); 
        for (var i = 0; i < barra.children.length; i++) {
           this.log(barra.children[i])
           this.$ballpit.createComponent(barra.children[i]);
        };
		    /* this.setupBalls(); */

        // this.$.ballpit.children[0].destroy()
			  // enyo.cancelRequestAnimationFrame(this.cancel);
      }
    // this.log("Simulated Service Message Occurred at " + inTime);
  },
	published: {
		// force of gravity
		accel: 0,
		// number of balls to show
		balls: 10
	},
	setupBalls: function() {
		// pause loop to update the balls
		if (this.cancel) {
      console.log("movidddd");
			enyo.cancelRequestAnimationFrame(this.cancel);
		}
		this.loopStart = Date.now();
		this.frame = 0;
		this.start = Date.now();
		this.$.ballpit.destroyClientControls();
		enyo.asyncMethod(this,"loop");
	},
	rendered: function() {
		this.setupBalls();
	},
	loop: function() {
		this.frame++;
		// update ball positions
		for (var i = 0, b; b = this.$.ballpit.children[i]; i++) {
			if (b.bounds.t + b.bounds.w > this.$.rectangle.bounds.t) {
				// hits the ground, bounce back with X% of velocity
				b.vel = -b.vel * b.bounce;
				b.bounds.t = this.$.rectangle.bounds.t - b.bounds.w;
			} else if (b.bounds.t < b.bounds.w) {
				// prevent balls from shooting over the ceiling
				b.bounds.t = b.bounds.w
				b.vel = 0;
			}
			b.vel += this.accel * (Date.now() - this.start);
			// make the distances rather large
			b.bounds.t += (b.vel / 10000);
		}
		this.$.canvas.update();
		this.start = Date.now();
		this.cancel = enyo.requestAnimationFrame(enyo.bind(this,"loop"));
		// draw the framerate
		// this.$.fpsCounter.setText(Math.floor(this.frame / ((Date.now() - this.loopStart) / 1000)));
		// this.$.fpsCounter.setText(texto);
	},
	reset: function() {
		var inode = this.$.balls.hasNode();
		var newballs = inode ? parseInt(inode.value) : this.balls;
		if (isFinite(newballs) && newballs >= 0 && newballs != this.balls) {
			// update the number of balls
			this.setBalls(newballs);
		} else {
			// reset the current balls without destroying / recreating them
			for (var i = 0, b; b = this.$.ballpit.children[i]; i++) {
				b.bounds.t = enyo.irand(375);
				b.vel = 0;
			}
		}
	},
	ballsChanged: function(inOldBalls) {
		this.setupBalls();
	}
});


