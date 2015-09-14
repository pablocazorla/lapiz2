LAPIZ.Utils = {
	each: function(collection, callback, descendent) {
		var desc = (typeof descendent === 'undefined') ? false : descendent;
		var length = collection.length;
		if (!desc) {
			for (var i = 0; i < length; i++) {
				callback.apply(null, [i]);
			}
		} else {
			for (var i = length - 1; i >= 0; i--) {
				callback.apply(null, [i]);
			}
		}
	},
	is: function(v) {
		return (typeof v !== 'undefined');
	},
	extend: function() {
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
	}
};