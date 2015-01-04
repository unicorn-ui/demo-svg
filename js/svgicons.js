(function(globalNamespace) {

	function AnimatedIcons($el, config, options) {
		var self = this;
		options = options || {};
		this.options = _.extend(this.options, options);
		this.$el = $el;
		this.svg = Snap(this.options.width, this.options.height);
		this.svg.attr('viewBox', '0 0 48 48');
		this.$el.append(this.svg.node);
		this.toggled = false;
		this.clickEvent = Modernizr.touch ? 'touchstart' : 'click';
		this.config = config;

		//Loads external svg file
		Snap.load(this.config.url, function (fragment) {
			var g = fragment.select('g');
			self.svg.append(g);

			//Toggle on click (or touch)
			self.$el.on(self.clickEvent, function(e) {
				self.toggle.call(self, e);
			});
		});
	}

	AnimatedIcons.prototype.options = {
		speed: 250,
		easing: mina.easeout,
		delay: 0,
		width: 48,
		height:48
	};

	AnimatedIcons.prototype.toggle = function(e) {

		//Loop all animations configured for this SVG
		_.each(this.config.animations, function(animation) {
			var el = this.svg.select(animation.el);
			var animProperties = this.toggled ? animation.from: animation.to;
			el.animate(animProperties, this.options.speed, this.options.easing, function() {
				console.log("Snap.svg animate callback. Do any 'post animatino' stuff here...");
			});
		}, this);
		this.toggled = !this.toggled;
	};

	globalNamespace.AnimatedIcons = AnimatedIcons;

})(window);

