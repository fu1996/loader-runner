function loader(source) {
	var callback = this.async();
	setTimeout(function() {
		callback(null, source + "-async-simple");
	}, 50);
}
loader.pitch = function(remainingRequest, previousRequest, data) {
	console.log("simple async pitching loader remainingRequest", remainingRequest);
	console.log("simple async pitching loader previousRequest", previousRequest);
};
module.exports = loader;
