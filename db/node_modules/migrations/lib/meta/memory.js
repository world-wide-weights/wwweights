

function Memory() {
  this.data = {};
}


Memory.prototype.set = function(data, cb) {
  this.data = data;
  cb();
};


Memory.prototype.get = function(cb) {
  cb(null, this.data);
};


module.exports = Memory;
