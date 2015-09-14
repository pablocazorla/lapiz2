LAPIZ.Sprite = (function() {
	'use strict';
	var u = LAPIZ.Utils,
		idCounter = 0;

	var spriteClass = function(drawFunction) {
		return this.init(drawFunction);
	};

	spriteClass.prototype = {
		init: function(drawFunction) {
			this.draw(drawFunction);
			this.id = idCounter++;
			this.childs = [];
			this.parent = null;
			this.visible = true;
			this.coordinates = {
				x: 0,
				y: 0,
				scale: 1,
				rotation: 0,
				opacity: 1
			}
			return this;
		},
		draw: function(drawFunction) {
			this.drawFunction = drawFunction || function() {};
			return this;
		},
		append: function(sprite) {
			sprite.remove();
			sprite.parent = this;
			this.childs.push(sprite);
			return this;
		},
		appendTo: function(spriteOrCanvas) {
			spriteOrCanvas.append(this);
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
		remove: function() {
			if (this.parent !== null) {
				this.parent.detach(this);
			}
			return this;
		},
		show:function(){
			this.visible = true;
			return this;
		},
		hide:function(){
			this.visible = false;
			return this;
		},
		render: function(painter) {
			if (this.visible && this.coordinates.opacity > 0) {
				// Set Coordinates
				painter.translate(this.coordinates.x, this.coordinates.y);
				if (this.coordinates.rotation !== 0) {
					var rotRadians = this.coordinates.rotation * Math.PI / 180;
					painter.rotate(rotRadians);
				}
				if (this.coordinates.scale !== 1) {
					painter.scale(this.coordinates.scale);
				}
				this.drawFunction(painter);
				var l = this.childs.length;
				for (var i = 0; i < l; i++) {
					this.childs[i].render(painter);
				}
				// Restore Coordinates
				if (this.coordinates.scale !== 1) {
					painter.scale(1 / this.coordinates.scale);
				}
				if (this.coordinates.rotation !== 0) {
					painter.rotate(-rotRadians);
				}
				painter.translate(-this.coordinates.x, -this.coordinates.y);
			}
			return this;
		}
	};

	return function(drawFunction) {
		return new spriteClass(drawFunction);
	};
})();