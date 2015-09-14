LAPIZ.Canvas = (function() {
	'use strict';

	// Request Animation Frames
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 20);
	};

	var u = LAPIZ.Utils,
		idCounter = 0;

	var canvasClass = function(idNode) {
		return this.init(idNode);
	};
	canvasClass.prototype = {
		init: function(idNode) {
			this.id = idCounter++;
			this.canvas = document.getElementById(idNode);

			this.painter = LAPIZ.Painter(this.canvas.getContext('2d'));
			this.childs = [];

			var self = this,
				renderCanvas = function() {
					self.render();
					window.requestAnimationFrame(renderCanvas);
				};
			renderCanvas();
			return this;
		},
		append: function(sprite) {
			sprite.remove();
			sprite.parent = this;
			this.childs.push(sprite);
			return this;
		},
		detach: function(sprite) {
			var l = this.childs.length,
				index = -1;
			for (var i = 0; i < l; i++) {
				if (this.childs[i].id === sprite.id) {
					index = i;
				}
			}
			sprite.parent = null;
			this.childs.splice(index, 1);
			return this;
		},
		render: function() {
			this.painter.reset().clear();
			var l = this.childs.length;
			for (var i = 0; i < l; i++) {
				this.childs[i].render(this.painter.reset());
			}
			return this;
		}
	};

	return function(idNode) {
		return new canvasClass(idNode);
	};
})();