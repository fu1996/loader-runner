/*
 * 本实例仅仅是大致思路的实现，具体的 pitch 和 loaderContext 的参数内容
 * 此处不做具体实现，可以把48行的注释放开，查看运行效果。
 *
 *
 * pitch loader  和 normal loader 的加载顺序不同的原因
 *
 * 1. 是因为 loaderContext 中使用 loaderIndex 为索引，通过pitch loader逻辑结束后，
 * 调用 processResource 方法 来重置 loaderIndex 的索引为loaders 的最后一位索引
 * 2. 在 pitch loader 有返回值的情况下，loaderContext 中使用 loaderIndex减一，
 * 后续的pitch loader将不会执行，直接切换为 normal loader 执行方法。
 * 3. 此种加载顺序方可满足 webpack 模块加载以及跨 loader 传参的业务场景。
 */

const loaderContext = {
	loaderIndex: 0,
	resource: "resource",
};

const loaderObj = [
	{
		pitchExecuted: false,
		normalExecuted: false,
		pitch: function() {
			console.log("pitch1");
		},
		normal: function(source) {
			console.log("normal1");
			return source + "-normal1";
		}
	},
	{
		pitchExecuted: false,
		normalExecuted: false,
		pitch: function() {
			console.log("pitch2");
		},
		normal: function(source) {
			console.log("normal2");
			return source + "-normal2";
		}
	},
	{
		pitchExecuted: false,
		normalExecuted: false,
		pitch: function() {
			console.log("pitch3");
			// return 'pitch3'
		},
		normal: function(source) {
			console.log("normal3");
			return source + "-normal3";
		}
	},
	{
		pitchExecuted: false,
		normalExecuted: false,
		pitch: function() {
			console.log("pitch4");
			return "pitch4";
		},
		normal: function(source) {
			console.log("normal4");
			return source + "-normal4";
		}
	},
];

loaderContext.loaders = loaderObj;

function iterateNormalLoaders(args) {
	if(loaderContext.loaderIndex < 0) {
		console.log("loader 全流程结束", args);
		return ;
	}
	var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
	if(currentLoaderObject.normalExecuted) {
		loaderContext.loaderIndex--;
		return iterateNormalLoaders(args);
	}
	const fn = currentLoaderObject.normal;
	currentLoaderObject.normalExecuted = true;
	if(!fn) return iterateNormalLoaders(args);
	args = fn.apply(loaderContext, [args]);
	iterateNormalLoaders(args);
}

function processResource() {
	// pitch loader  和 normal loader 的切换器
	// loaderContext.loaderIndex 置为 loaders 的最后的索引，因为
	// pitch loader  和 normal loader 数量可能不一致，切换到 normal loader 的时候，需要从最后一位开始执行
	loaderContext.loaderIndex = loaderContext.loaders.length - 1;
	iterateNormalLoaders(loaderContext.resource);
}

function iteratePitchingLoaders() {
	if(loaderContext.loaderIndex >= loaderContext.loaders.length) {
		return processResource();
	}

	var currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
	if(currentLoaderObject.pitchExecuted) {
		loaderContext.loaderIndex++;
		return iteratePitchingLoaders();
	}
	const fn = currentLoaderObject.pitch;
	currentLoaderObject.pitchExecuted = true;
	if(!fn) return iteratePitchingLoaders();
	const args = fn.apply(null, []);
	if(args) {
		loaderContext.loaderIndex--;
		iterateNormalLoaders(args);
	} else {
		iteratePitchingLoaders();
	}
}

iteratePitchingLoaders();
