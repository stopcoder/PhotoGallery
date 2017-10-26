var express = require("express");
var app = express();
var fs = require('fs');
var path = require('path');

var sizeOf = require('probe-image-size');

var prefix = "/pic";
// change this one to the real folder path
var photoFolder = "/test";

var walk = function(dir) {
	return new Promise(function(resolve, reject) {
		var promises = [];
		fs.readdir(dir, function(err, list) {
			if (err) {
				return reject(err);
			}

			list.forEach(function(file) {
				file = path.resolve(dir, file);
				promises.push(new Promise(function(resolve, reject) {
					fs.stat(file, function(err, stat) {
						if (stat && stat.isDirectory()) {
							walk(file).then(results => {
								resolve(results);
							});
						} else {
							if (file.toLowerCase().endsWith("jpg")) {
								var input = fs.createReadStream(file);
								console.log(file);
								sizeOf(input).then(result => {
									input.destroy();


									resolve({
										path: file,
										dimensions: {
											w: result.width,
											h: result.height
										}
									});
								});
							} else {
								resolve();
							}
						}
					});
				}));
			});

			Promise.all(promises).then(results => {
				var res = [];
				results.forEach(function(result) {
					if (Array.isArray(result)) {
						res = res.concat(result);
					} else if (result) {
						res.push(result);
					}
				});
				resolve(res);
			});
		});
	});

};

app.set("view engine", "pug");

app.get("/", function(req, res) {
	walk(photoFolder).then(list => {
		res.append("Access-Control-Allow-Origin", "*");

		list = list.map(function(file) {
			file.path = file.path.replace(photoFolder, prefix);
			return file;
		});

		res.render("index", {
			pics: list
		});
	});
});

app.use(prefix, express.static(photoFolder));
app.use(express.static("public"));

app.get('/list', function (req, res) {
	walk(photoFolder, function(err, list) {
		if (err) {
			res.send("err!");
			return;
		}

		res.append("Access-Control-Allow-Origin", "*");

		list = list.map(function(file) {
			return file.replace(photoFolder, prefix);
		});

		res.json(list);
	})
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});
