var connections = 0; // count active connections

console.log('a\'m worker 1');

self.addEventListener("connect", function (e) {

	console.log('a\'m worker 2');

	var port = e.ports[0];
	connections++;

	port.addEventListener("message", function (e) {
		port.postMessage("Hello " + e.data + " (port #" + connections + ")");
	}, false);

	port.start();

}, false);
