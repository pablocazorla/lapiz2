var myCanvas = LAPIZ.Canvas('my-canvas');




var gr = myCanvas.painter.gradient({
	type:'radial',
	from:[150,290,0],
	to:[150,0,300],
	colors:[
		[0,'#FFF'],
		[0.2,'#F00'],
		[0.4,'#FF0'],
		[0.6,'#0F0'],
		[0.8,'#0FF'],
		[1,'#000']
	]
});




myCanvas.painter.fillStyle('blue');



var cosa1 = LAPIZ.Sprite(function(painter) {

painter.fillStyle(gr);

	painter
		.beginPath()
		.moveTo(0, 0)
		.lineTo(300, 0)
		.lineTo(300, 300)
		.lineTo(0, 300)
		.lineTo(0, 0)
		.closePath()
		.fill()
		.stroke();
});
var cosa2 = LAPIZ.Sprite();
var cosa3 = LAPIZ.Sprite();

cosa1.appendTo(myCanvas);

cosa2.append(cosa3);
myCanvas.append(cosa2);
cosa3.remove();
myCanvas.detach(cosa2);