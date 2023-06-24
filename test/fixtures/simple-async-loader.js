module.exports = function(source) {
	// 1. 把 isSync 标识置为false
	// 2. 此处的callback 指向了 innerCallback
	var callback = this.async();
	setTimeout(function() {
		// 3. 调用innerCallback 并回传处理过的值
		callback(null, source + "-async-simple");
	}, 50);
};
