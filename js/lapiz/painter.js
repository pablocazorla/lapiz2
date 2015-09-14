LAPIZ.Painter = (function() {
	'use strict';

	var u = LAPIZ.Utils,
		painterClass = function(c) {
			return this.init(c);
		};
	painterClass.prototype = {
		init: function(c) {
			this.c = c;
			return this;
		},
		// C operations
		reset: function() {
			this.c.setTransform(1, 0, 0, 1, 0, 0);
			return this;
		},
		clear: function() {
			this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
			return this;
		},
		translate: function(x, y) {
			this.c.translate(x, y);
			return this;
		},
		rotate: function(angle) {
			this.c.rotate(angle);
			return this;
		},
		scale: function(scale) {
			this.c.scale(scale, scale);
			return this;
		},
		// Style		
		style: function(o) {
			if (u.is(o)) {
				for (var a in o) {
					if (typeof this.c[a] != 'undefined') {
						this.c[a] = o[a];
					}
				}
				return this;
			} else {
				return this.c;
			}

		},
		fillStyle: function(v) {
			this.c.fillStyle = v;
			return this;
		},
		/*
		get fillStyle() {
			return this.c.fillStyle;
		},
		set fillStyle(v) {
			this.c.fillStyle = v;
		},*/
		strokeStyle: function(v) {
			this.c.strokeStyle = v;
			return this;
		},
		font: function(v) {
			this.c.font = v;
			return this;
		},
		textBaseline: function(v) {
			this.c.textBaseline = v;
			return this;
		},
		textAlign: function(v) {
			this.c.textAlign = v;
			return this;
		},
		lineJoin: function(v) {
			this.c.lineJoin = v;
			return this;
		},
		lineWidth: function(v) {
			this.c.lineWidth = v;
			return this;
		},
		lineDashOffset: function(v) {
			this.c.lineDashOffset = v;
			return this;
		},
		lineCap: function(v) {
			this.c.lineCap = v;
			return this;
		},
		miterLimit: function(v) {
			c.miterLimit = v;
			return this;
		},
		globalAlpha: function(v) {
			this.c.globalAlpha = v;
			return this;
		},
		globalCompositeOperation: function(v) {
			this.c.globalCompositeOperation = v;
			return this;
		},
		shadowColor: function(v) {
			this.c.shadowColor = v;
			return this;
		},
		shadowBlur: function(v) {
			this.c.shadowBlur = v;
			return this;
		},
		shadowOffsetX: function(v) {
			this.c.shadowOffsetX = v;
			return this;
		},
		shadowOffsetY: function(v) {
			this.c.shadowOffsetY = num;
			return this;
		},
		// Compound Styles
		shadow: function(str) {
			// Example: 1px 3px 6px rgba(0,0,0,0.5)
			var a = str.split(' ');
			this.c.shadowOffsetX = a[0];
			this.c.shadowOffsetY = a[1];
			this.c.shadowBlur = a[2];
			this.c.shadowColor = a[3];
			return this;
		},
		// Drawing
		beginPath: function() {
			this.c.beginPath();
			return this;
		},
		closePath: function() {
			this.c.closePath();
			return this;
		},
		fill: function() {
			this.c.fill();
			return this;
		},
		stroke: function() {
			this.c.stroke();
			return this;
		},
		moveTo: function(x, y) {
			this.c.moveTo(x, y);
			return this;
		},
		lineTo: function(x, y) {
			this.c.lineTo(x, y);
			return this;
		},
		arc: function(x, y, radius, startAngle, endAngle, counterClockwise) {
			this.c.arc(x, y, radius, startAngle, endAngle, counterClockwise);
			return this;
		},
		arcTo: function(x1, y1, x2, y2, radius) {
			this.c.arcTo(x1, y1, x2, y2, radius);
			return this;
		},
		quadraticCurveTo: function(xCtrl, yCtrl, x, y) {
			this.c.quadraticCurveTo(xCtrl, yCtrl, x, y);
			return this;
		},
		bezierCurveTo: function(xCtrl1, yCtrl1, xCtrl2, yCtrl2, x, y) {
			this.c.bezierCurveTo(xCtrl1, yCtrl1, xCtrl2, yCtrl2, x, y);
			return this;
		},
		rect: function(x, y, width, height) {
			this.c.rect(x, y, width, height);
			return this;
		},
		fillRect: function(x, y, width, height) {
			this.c.fillRect(x, y, width, height);
			return this;
		},
		strokeRect: function(x, y, width, height) {
			this.c.strokeRect(x, y, width, height);
			return this;
		},
		clearRect: function() {
			this.c.clearRect(x, y, width, height);
			return this;
		},
		// Text
		fillText: function(text, x, y) {
			this.c.fillText(text, x, y);
			return this;
		},
		strokeText: function(text, x, y) {
			this.c.strokeText(text, x, y);
			return this;
		},
		measureText: function(text) {
			return this.c.measureText(text);
		},
		textWidth: function(text) {
			return this.c.measureText(text).width;
		},
		// Gradient
		createLinearGradient: function(x1, y1, x2, y2) {
			return this.c.createLinearGradient(x1, y1, x2, y2);
		},
		createRadialGradient: function(x1, y1, r1, x2, y2, r2) {
			return this.c.createRadialGradient(x1, y1, r1, x2, y2, r2);
		},
		addColorStop: function(gradient, point, color) {
			gradient.addColorStop(point, color);
			return gradient;
		},
		// Compound Gradient
		gradient: function(options) {
			var g,
				d = u.extend({
					type: 'linear',
					from: [0, 0, 0], // [x,y,radius]
					to: [100, 100, 100], // [x,y,radius]
					colors: [
						[0, '#000'],
						[1, '#FFF']
					]
				}, options);

			if (d.type === 'linear') {
				g = this.c.createLinearGradient(d.from[0], d.from[1], d.to[0], d.to[1]);
			} else {
				g = this.c.createRadialGradient(d.from[0], d.from[1], d.from[2], d.to[0], d.to[1], d.to[2]);
			}
			var l = d.colors.length;
			for (var i = 0; i < l; i++) {
				g.addColorStop(d.colors[i][0], d.colors[i][1]);
			}
			this.c.fillStyle = g;
			return g;
		},
		// pattern
		createPattern: function(img, rep) {
			this.c.createPattern(img, rep);
			return this;
		},
		pattern: function(img, rep) {
			var p = this.c.createPattern(img, rep);
			this.c.fillStyle = p;
			return p;
		},

		// STATE STACK
		save: function() {
			this.c.save();
			return this;
		},
		restore: function() {
			this.c.restore();
			return this;
		},

		// Clip
		clip: function() {
			this.c.clip();
			return this;
		},

		// data url
		toDataURL: function() {
			return this.c.toDataURL();
		},

		// Images
		drawImage: function() {
			this.c.drawImage.apply(null, arguments);
			return this;
		},
		createImageData: function(width, height) {
			return this.c.createImageData(width, height);
		},
		getImageData: function(x, y, width, height) {
			return this.c.getImageData(x, y, width, height);
		},
		putImageData: function() {
			this.c.putImageData.apply(null, arguments);
			return this;
		},
		image: function() {
			return this;
		},
		// Compound Shapes		
		Rectangle: function(x,y,w,h,borderRadius) {

		}



	};

	return function(c) {
		return new painterClass(c);
	};
})();