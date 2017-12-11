
exports.loadFile = function(fileName,callback,callBackNotFound) {

    var fs = require("fs");

    fs.exists(fileName, function(exists) {
    if (exists) {
        fs.stat(fileName, function(error, stats) {
        fs.open(fileName, "r", function(error, fd) {
            var buffer = new Buffer(stats.size);

            fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
            var data = buffer.toString("utf8", 0, buffer.length);
            callback(data)
            fs.close(fd);
            });
        });
        });
    }
    else{
        callBackNotFound();
    }
    });
}

exports.loadFileSync = function(fileName) {
    
        var fs = require("fs");
        return  fs.readFileSync(fileName).toString();

    }