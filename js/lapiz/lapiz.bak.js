// LAPIZ
;
(function() {

	// Request Animation Frames
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 20);
	};

	var
	/*
	 * Utils *******************************************************************************************************
	 */
	// Console
		k = function(str) {
			try {
				console.log(str);
			} catch (e) {};
		},
		// extend objects
		extend = function() {
			var dest = {},
				ext = function(destination, source) {
					var source = source || {};
					for (var property in source) {
						if (source[property] && source[property].constructor && source[property].constructor === Object) {
							destination[property] = destination[property] || {};
							arguments.callee(destination[property], source[property]);
						} else {
							destination[property] = source[property];
						}
					}
					return destination;
				};
			for (i = 0; i < arguments.length; i++) {
				dest = ext(dest, arguments[i]);
			}
			return dest;
		},
		// DOM Event Handler
		on = function(eventTarget, eventType, eventHandler) {
			eventTarget.node.addEventListener(eventType, eventHandler, false);
		},
		stringNumberToArray = function(str) {
			if (typeof str != 'string') {
				return [str, str, str, str];
			} else {
				var arr = str.split(' '),
					v1, v2, v3, v4;
				switch (arr.length) {
					case 2:
						v1 = v3 = parseInt(arr[0]);
						v2 = v4 = parseInt(arr[1]);
						break;
					case 3:
						v1 = parseInt(arr[0]);
						v2 = v4 = parseInt(arr[1]);
						v3 = parseInt(arr[2]);
						break;
					case 4:
						v1 = parseInt(arr[0]);
						v2 = parseInt(arr[1]);
						v3 = parseInt(arr[2]);
						v4 = parseInt(arr[3]);
						break;
					default:
						v1 = v2 = v3 = v4 = parseInt(arr[0]);
				}
				return [v1, v2, v3, v4];
			}
		},



		/*
		 * Private variables *******************************************************************************************************
		 */

		// Context
		c,

		// overMouse
		overMouse = false,
		eventMouseInfo = {
			type: null,
			x: 0,
			y: 0
		},

		// if use Sprites
		spriteMode = false,

		// Counter ti generate differents IDs.
		idCounter = 0,

		defOptions = {
			x: 0,
			y: 0,
			fillStyle: '#808080',
			font: '10px sans-serif',
			globalAlpha: 1,
			globalCompositeOperation: 'source-over',
			lineCap: 'butt',
			lineDashOffset: 0,
			lineJoin: 'miter',
			lineWidth: 1,
			miterLimit: 10,
			shadowBlur: 0,
			shadowColor: 'rgba(0, 0, 0, 0)',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			strokeStyle: '#000000',
			textAlign: 'start',
			textBaseline: 'alphabetic'
		},

		// Mouse Event list
		MouseEventList = ['click', 'mousedown', 'mouseup', 'mousemove'],

		// Animation
		animationCurves = (function() {
			var defaultAc = 'ease',
				delay = 10,

				// Functions
				quad = function(p, e) {
					var exp = e || 2;
					return Math.pow(p, exp)
				},
				bow = function(p, e) {
					var exp = e || 1.5;
					return Math.pow(p, 2) * ((exp + 1) * p - exp);
				},
				elastic = function(p, e) {
					var exp = e || 1.5;
					return Math.pow(2, 10 * (p - 1)) * Math.cos(20 * Math.PI * exp / 3 * p);
				},

				inverse = function(delta, p, e) {
					return 1 - delta(1 - p, e);
				},
				inOut = function(delta, p, e) {
					if (p < .5) {
						return delta(2 * p, e) / 2;
					} else {
						return (2 - delta(2 * (1 - p), e)) / 2;
					}
				},

				// Formulas
				linear = function(p) {
					return p;
				},
				ease = function(p) {
					return inOut(quad, p, 2);
				},
				easeIn = function(p) {
					return quad(p, 2.3);
				},
				easeOut = function(p) {
					return inverse(quad, p, 2.3);
				},
				bounce = function(p, elast) {
					var elasticity = 4/(elast || 1),
						resolution = 9,
						d = 1 - Math.pow(1 - p, elasticity) * Math.abs(Math.cos((p) * Math.PI * resolution * Math.pow(p, 1 / elasticity)));
					if (isNaN(d)) {
						d = p;
					}
					return d;
				};

			return {
				defaultAc: defaultAc,
				delay: delay,
				linear: linear,
				ease: ease,
				easeIn: easeIn,
				easeOut: easeOut,
				bounce: bounce
			};
		})(),

		/*
		 * Private handlers *******************************************************************************************************
		 */
		// Canvas List handler.
		canvasList = {
			list: [],
			length: 0,
			find: function(selection) {
				var idSelection = (typeof selection == 'string') ? selection : this.nodeId(selection),
					canvasToReturn = false;
				for (var i = 0; i < this.length; i++) {
					if (this.list[i].id == idSelection) {
						canvasToReturn = this.list[i];
					}
				}
				return canvasToReturn;
			},
			nodeId: function(node) {
				var idCanvas = node.getAttribute('id');
				if (idCanvas == '' || idCanvas == undefined) {
					idCanvas = 'canvas-' + idCounter;
					idCounter++;
					node.setAttribute('id', idCanvas);
				}
				return idCanvas;
			},
			newCanvas: function(selection) {
				var idSelection = (typeof selection == 'string') ? selection : this.nodeId(selection),
					nc = new cnv(idSelection);
				this.list.push(nc);
				this.length++;
				return nc;
			},
			getNumSprites: function() {
				var num = 0;
				for (var i = 0; i < this.length; i++) {
					num += this.list[i].length;
				}
				return num;
			},
			render: function() {
				for (var i = 0; i < this.length; i++) {
					this.list[i].render();
				}
			}
		},

		/*
		 * Private Classes *******************************************************************************************************
		 */
		// Canvas Class
		cnv = function(selection) {
			return this.init(selection);
		},

		// Sprite Class
		spr = function(shapeFunction, options) {
			return this.init(shapeFunction, options);
		};

	/*
	 * Private Classes Definitions *******************************************************************************************************
	 */
	// Canvas Class Definition
	cnv.prototype = {
		type: 'canvas',
		init: function(selection) {
			this.node = document.getElementById(selection);
			this.id = selection;
			if (this.node != undefined) {
				// Context
				this.context = this.node.getContext('2d');
				this.eventInfo = {
					type: null,
					x: 0,
					y: 0
				}
				this.setMouseEvents();

			} else {
				k('There is not canvas with id: ' + selection + '.');
			}
			this.childs = [];
			this.length = 0;

			return this;
		},
		append: function(sprite) {
			if (sprite.parent != null) {
				sprite.parent.detach(sprite);
			}
			this.childs.push(sprite);
			this.length++;
			sprite.parent = this;
			sprite.parentCanvas = this;
			sprite.updateParentCanvasForChilds();
			lapiz.verifySpriteMode();
			return this;
		},
		detach: function(sprite) {
			if (sprite.type == 'sprite') {
				for (var i = 0; i < this.length; i++) {
					if (this.childs[i].id == sprite.id) {
						sprite.parent = null;
						this.childs.splice(i, 1);
						this.length--;
						lapiz.verifySpriteMode();
					}
				}
			}
			return this;
		},
		render: function() {
			lapiz.width = this.node.width;
			lapiz.height = this.node.height;
			c = this.context;
			c.setTransform(1, 0, 0, 1, 0, 0);
			c.clearRect(0, 0, this.node.width, this.node.height);
			for (var i = 0; i < this.length; i++) {
				c.setTransform(1, 0, 0, 1, 0, 0);

				this.childs[i].render();
			}
			this.eventInfo.type = null;
		},
		// Mouse Events
		setMouseEvents: function() {
			var self = this;
			for (var i = 0; i < MouseEventList.length; i++) {
				on(self, MouseEventList[i], function(evt) {
					var rect = self.node.getBoundingClientRect();
					self.eventInfo = {
						type: evt.type,
						x: Math.round(evt.clientX - rect.left),
						y: Math.round(evt.clientY - rect.top)
					};
				});
			}
			return this;
		},
		cursor: function(styleCursor) {
			this.node.style.cursor = styleCursor;
			return this;
		}
	};

	// Sprite Class Definition
	spr.prototype = {
		type: 'sprite',
		init: function(shapeFunction) {
			this.id = 'spr-' + idCounter;
			idCounter++;
			return this.reset().shape(shapeFunction);
		},
		reset: function() {
			this.shp = null;
			this.x = 0;
			this.y = 0;
			this.xScale = 1;
			this.yScale = 1;
			this.rotation = 0;
			this.parent = null;
			this.parentCanvas = null;
			this.childs = [];
			this.length = 0;
			this.mouseEvents = false;
			this.mouseEventList = [];
			this.overMouse = false;
			this.preOverMouse = false;
			this.animationList = [];

			return this;
		},
		shape: function(shapeFunction) {
			this.shp = shapeFunction || function() {};
			return this;
		},
		updateParentCanvasForChilds: function() {
			for (var i = 0; i < this.length; i++) {
				this.childs[i].parentCanvas = this.parentCanvas;
				this.childs[i].updateParentCanvasForChilds();
			}
			return this;
		},
		append: function(sprite) {
			if (sprite.type == 'sprite') {
				if (sprite.parent != null) {
					sprite.parent.detach(sprite);
				}
				this.childs.push(sprite);
				this.length++;
				sprite.parent = this;
				sprite.parentCanvas = this.parentCanvas;
				sprite.updateParentCanvasForChilds();
			}
			return this;
		},
		appendTo: function(spriteOrCanvas) {
			if (spriteOrCanvas.type == 'sprite') {
				//Sprite
				spriteOrCanvas.append(this);
			} else {
				//Canvas
				lapiz.getCanvas(spriteOrCanvas).append(this);
			}
			return this;
		},
		detach: function(sprite) {
			if (sprite.type == 'sprite') {
				for (var i = 0; i < this.length; i++) {
					if (this.childs[i].id == sprite.id) {
						sprite.parent = null;
						sprite.parentCanvas = null;
						sprite.updateParentCanvasForChilds();
						this.childs.splice(i, 1);
						this.length--;
					}
				}
			}
			return this;
		},
		transform: function(coordinates) {
			for (var a in coordinates) {
				if (typeof this[a] != 'undefined') {
					this[a] = coordinates[a];
				}
			}
			return this;
		},
		blowOverMouse: function() {
			if (this.parent != null) {
				if (this.parent.type == 'sprite') {
					this.parent.overMouse = true;
					this.parent.blowOverMouse();
				}
			}
		},
		render: function() {
			var self = this,
				rotRadians = this.rotation * Math.PI / 180;
			// Set Coordinates
			c.translate(this.x, this.y);
			c.rotate(rotRadians);
			c.scale(this.xScale, this.yScale);
			for (var ef = 0; ef < this.enterFrameEvent.length; ef++) {
				this.enterFrameEvent.handlers[ef].apply(this, [self]);
			}

			// Render
			overMouse = false;

			eventMouseInfo.type = this.parentCanvas.eventInfo.type;
			eventMouseInfo.x = this.parentCanvas.eventInfo.x;
			eventMouseInfo.y = this.parentCanvas.eventInfo.y;

			this.shp();
			this.overMouse = overMouse;

			if (overMouse) {
				this.blowOverMouse();
			}

			// Render Childs
			for (var i = 0; i < this.length; i++) {
				this.childs[i].render();
			}

			this.fireEvents();
			this.preOverMouse = this.overMouse;
			// Restore Coordinates
			c.scale(1 / this.xScale, 1 / this.yScale);
			c.rotate(-rotRadians);
			c.translate(-this.x, -this.y);

			return this;
		},
		enterFrameEvent: {
			handlers: [],
			length: 0
		},
		onEnterFrame: function(handler) {
			this.enterFrameEvent.handlers.push(handler);
			this.enterFrameEvent.length++;
			return this;
		},
		// Mouse Events
		on: function(eventName, handler) {
			this.mouseEventList.push({
				type: eventName,
				handler: handler
			});
			return this;
		},
		click: function(handler) {
			return this.on('click', handler);
		},
		mousemove: function(handler) {
			return this.on('mousemove', handler);
		},
		mousedown: function(handler) {
			return this.on('mousedown', handler);
		},
		mouseup: function(handler) {
			return this.on('mouseup', handler);
		},
		mouseover: function(handler) {
			return this.on('mouseover', handler);
		},
		mouseout: function(handler) {
			return this.on('mouseout', handler);
		},
		hover: function(handlerOver, handlerOut) {
			this.on('mouseover', handlerOver);
			if (handlerOut) {
				this.on('mouseout', handlerOut);
			}
			return this;
		},
		fireEvents: function() {
			if (this.parentCanvas != null) {
				var self = this;
				for (var i = 0; i < this.mouseEventList.length; i++) {
					if (self.overMouse) {
						switch (this.mouseEventList[i].type) {
							case 'mouseover':
								if (!self.preOverMouse && self.overMouse) {
									eventMouseInfo.type = 'mouseover';
									this.mouseEventList[i].handler.apply(self, [eventMouseInfo]);
								}
								break;
							case 'mouseup':
								if (eventMouseInfo.type == 'click' || eventMouseInfo.type == 'mouseup') {
									this.mouseEventList[i].handler.apply(self, [{
										type: 'mouseup',
										x: eventMouseInfo.x,
										y: eventMouseInfo.y
									}]);
								}
								break;
							default:
								if (eventMouseInfo.type == this.mouseEventList[i].type) {
									this.mouseEventList[i].handler.apply(self, [eventMouseInfo]);
								}
						}
					} else {
						if (self.preOverMouse && this.mouseEventList[i].type == 'mouseout') {
							eventMouseInfo.type = 'mouseout';
							this.mouseEventList[i].handler.apply(self, [eventMouseInfo]);
						}
					}
				}
			}
			return this;
		},
		animate: function(obj, duration, callback, delta, exp) {
			var spr = this,
				d = delta || lapiz.animationCurves.defaultAc,
				cb = callback || function() {},
				start = new Date,
				initStatus = {};

			for (var a in obj) {
				initStatus[a] = spr[a];
			};

			var timer = setInterval(function() {
				var progress = (new Date - start) / duration;
				if (progress > 1) {
					progress = 1;
				}

				var delta = lapiz.animationCurves[d](progress, exp);

				for (var a in obj) {
					spr[a] = initStatus[a] + delta * (obj[a] - initStatus[a]);
				}

				if (progress == 1) {
					cb.apply(spr);
					clearInterval(timer);
				}
			}, lapiz.animationCurves.delay);
			return this;
		}
	};

	/*
	 * Public Lapiz *******************************************************************************************************
	 */
	var lapiz = {
		width: 0,
		height: 0,
		extendObject: extend,
		stringNumberToArray: stringNumberToArray,
		valueToReturn: false,
		animationCurves : animationCurves,

		init: function() {
			var cnv = document.getElementsByTagName('canvas');
			if (cnv.length > 0) {
				this.setCanvas(cnv[0]);
			}

			return this;
		},
		sprite: function(shapeFunction, options) {
			return new spr(shapeFunction, options);
		},
		getCanvas: function(selection) {
			var preCanvas = canvasList.find(selection);
			if (preCanvas) {
				return preCanvas;
			} else {
				var newCanvas = canvasList.newCanvas(selection);
				return newCanvas;
			}
		},
		setCanvas: function(selection) {
			var theCanvas = this.getCanvas(selection);
			c = theCanvas.context;
			this.width = theCanvas.node.width;
			this.height = theCanvas.node.height;
			return this;
		},
		verifySpriteMode: function() {
			var numSprites = canvasList.getNumSprites(),
				renderCanvas;
			if (numSprites > 0) {
				spriteMode = true;
				renderCanvas = function() {
					canvasList.render();
					window.requestAnimationFrame(renderCanvas);
				};
			} else {
				renderCanvas = function() {};
				spriteMode = false;
			}
			renderCanvas();
			return this;
		},

		// Style		
		setStyles: function(o) {
			for (var a in o) {
				if (typeof c[a] != 'undefined') {
					c[a] = o[a];
				}
			}
			return this;
		},
		fillStyle: function(v) {
			c.fillStyle = v;
			return this;
		},
		strokeStyle: function() {
			return this;
		},
		font: function(v) {
			c.font = v;
			return this;
		},
		textBaseline: function(v) {
			c.textBaseline = v;
			return this;
		},
		textAlign: function(v) {
			c.textAlign = v;
			return this;
		},
		lineJoin: function(v) {
			c.lineJoin = v;
			return this;
		},
		lineWidth: function(v) {
			c.lineWidth = v;
			return this;
		},
		lineDashOffset: function(v) {
			c.lineDashOffset = v;
			return this;
		},
		lineCap: function(v) {
			c.lineDashOffset = v;
			return this;
		},
		miterLimit: function(v) {
			c.lineDashOffset = v;
			return this;
		},
		globalAlpha: function(v) {
			c.lineDashOffset = v;
			return this;
		},
		globalCompositeOperation: function(v) {
			c.lineDashOffset = v;
			return this;
		},
		shadowColor: function(v) {
			c.shadowColor = v;
			return this;
		},
		shadowBlur: function(v) {
			c.shadowBlur = v;
			return this;
		},
		shadowOffsetX: function(v) {
			c.shadowOffsetX = v;
			return this;
		},
		shadowOffsetY: function(v) {
			c.shadowOffsetY = num;
			return this;
		},
		// Compound Styles
		shadow: function(strOrArray) {
			//
			return this;
		},

		// Paths
		beginPath: function() {
			c.beginPath();
			return this;
		},
		moveTo: function(x, y) {
			c.moveTo(x, y);
			return this;
		},
		lineTo: function(x, y) {
			c.lineTo(x, y);
			return this;
		},
		arc: function(x, y, radius, startAngle, endAngle, counterClockwise) {
			c.arc(x, y, radius, startAngle, endAngle, counterClockwise);
			return this;
		},
		arcTo: function(x1, y1, x2, y2, radius) {
			c.arcTo(x1, y1, x2, y2, radius);
			return this;
		},
		quadraticCurveTo: function(xCtrl, yCtrl, x, y) {
			c.quadraticCurveTo(xCtrl, yCtrl, x, y);
			return this;
		},
		bezierCurveTo: function(xCtrl1, yCtrl1, xCtrl2, yCtrl2, x, y) {
			c.bezierCurveTo(xCtrl1, yCtrl1, xCtrl2, yCtrl2, x, y);
			return this;
		},
		closePath: function() {
			c.closePath();
			return this;
		},
		rect: function(x, y, width, height) {
			c.rect(x, y, width, height);
			return this;
		},
		fillRect: function(x, y, width, height) {
			c.fillRect(x, y, width, height);
			return this;
		},
		strokeRect: function(x, y, width, height) {
			c.strokeRect(x, y, width, height);
			return this;
		},
		clearRect: function() {
			c.clearRect(x, y, width, height);
			return this;
		},
		fill: function() {
			if (this.valueToReturn) {
				c.fillStyle = this.valueToReturn;
				this.valueToReturn = false;
			}
			c.fill();
			if (c.isPointInPath(eventMouseInfo.x, eventMouseInfo.y)) {
				overMouse = true;
			}
			return this;
		},
		stroke: function() {
			if (this.valueToReturn) {
				c.strokeStyle = this.valueToReturn;
				this.valueToReturn = false;
			}
			c.stroke();
			if (c.isPointInPath(eventMouseInfo.x, eventMouseInfo.y)) {
				overMouse = true;
			}
			return this;
		},
		endShape: function() {
			this.fill().stroke();
			return this;
		},

		// Text
		fillText: function(text, x, y) {
			c.fillText(text, x, y);
			return this;
		},
		strokeText: function(text, x, y) {
			c.strokeText(text, x, y);
			return this;
		},
		measureText: function(text) {
			return c.measureText(text);
		},
		textWidth: function(text) {
			return c.measureText(text).width;
		},

		// gradients
		createLinearGradient: function(x1, y1, x2, y2) {
			this.valueToReturn = c.createLinearGradient(x1, y1, x2, y2);
			return this;
		},
		createRadialGradient: function(x1, y1, r1, x2, y2, r2) {
			this.valueToReturn = c.createRadialGradient(x1, y1, r1, x2, y2, r2);
			return this;
		},
		addColorStop: function(point, color) {
			this.valueToReturn.addColorStop(point, color);
			return this;
		},
		returnValue: function() {
			var r = this.valueToReturn;
			this.valueToReturn = false;
			return r;
		},
		// Compound Gradients
		linearGradient: function(x1, y1, x2, y2, colors) {
			if (typeof colors == 'string') {
				this.valueToReturn = colors;
			} else {
				this.createLinearGradient(x1, y1, x2, y2);
				for (var a in colors) {
					this.addColorStop(parseInt(a), colors[a])
				}
			}
			return this;
		},
		radialGradient: function(x1, y1, r1, x2, y2, r2, colors) {
			if (typeof colors == 'string') {
				this.valueToReturn = colors;
			} else {
				this.createRadialGradient(x1, y1, r1, x2, y2, r2);
				for (var a in colors) {
					this.addColorStop(parseInt(a), colors[a])
				}
			}
			return this;
		},

		// pattern
		createPattern: function(img, rep) {
			this.valueToReturn = c.createPattern(img, rep);
			return
		},

		// STATE STACK
		save: function() {
			c.save();
			return this;
		},
		restore: function() {
			c.restore();
			return this;
		},

		// Clip
		clip: function() {
			c.clip();
			return this;
		},

		// data url
		toDataURL: function() {
			return c.toDataURL();
		},

		// Images
		drawImage: function() {
			c.drawImage();
			return this;
		},
		createImageData: function() {
			return this;
		},
		getImageData: function() {
			return this;
		},
		putImageData: function() {
			return this;
		},

		// Compound Shapes		
		Rectangle: function(custom) {
			var o = extend(defOptions, {
					width: 100,
					height: 50,
					borderRadius: 0
				}, custom),
				b = (o.borderRadius == 0) ? 0 : stringNumberToArray(o.borderRadius);
			this
				.setStyles(o)
				.beginPath();
			if (b == 0) {
				this.rect(o.x, o.y, o.width, o.height);
			} else {
				this
					.moveTo(o.x + b[0], o.y)
					.lineTo(o.x + o.width - b[1], o.y)
					.quadraticCurveTo(o.x + o.width, o.y, o.x + o.width, o.y + b[1])
					.lineTo(o.x + o.width, o.y + o.height - b[2])
					.quadraticCurveTo(o.x + o.width, o.y + o.height, o.x + o.width - b[2], o.y + o.height)
					.lineTo(o.x + b[3], o.y + o.height)
					.quadraticCurveTo(o.x, o.y + o.height, o.x, o.y + o.height - b[3])
					.lineTo(o.x, o.y + b[0])
					.quadraticCurveTo(o.x, o.y, o.x + b[0], o.y);
			}
			this
				.closePath()
				.endShape();
			return this;
		},
		Circle: function(custom) {
			var o = extend(defOptions, {
				radius: 20
			}, custom);
			this
				.setStyles(o)
				.beginPath()
				.arc(o.x, o.y, o.radius, 0, Math.PI * 2)
				.closePath()
				.endShape();
			return this;
		},

		mostrar: function() {
			return this;
		},
		esta: function() {
			return true;
		}
	};

	window.lapiz = lapiz.init();
})();