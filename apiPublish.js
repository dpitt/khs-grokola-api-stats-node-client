var os = require('os');
var net = require('net');
var stream = require('stream');
var http = require('http');

Buffer.prototype.toByteArray = function() {
	return Array.prototype.slice.call(this, 0);
}

module.exports = {
	apis: [],	
	serviceName: undefined,
	grokola: "http://127.0.0.1:8080/sherpa/api/stats/test",	
	threshold: 10,	
	server: '',
	referenceId: 0,
	uri: "sherpa/api/stats",
	token: undefined,
	
	_getToken: function() {
		return this.token;
	},
	
	_setToken: function(token) {
		this.token = token;
	},
	
	_getReferenceId: function() {
		return this.referenceId;
	},
	
	_setReferenceId: function(referenceId) {
		this.referenceId = referenceId;
	},
	
	_getServer: function() {
		return this.server;
	},
	
	_setServer: function(server) {
		this.server = server;
	},
	
	_getThreshold: function() {
		return this.threshold;
	},
	
	_setThreshold: function(threshold) {
		this.threshold = threshold;
	},
	
	_serviceName: function() {
		if (this.serviceName == undefined) this.serviceName = this.hostName();
		return this.serviceName;
	},
	
	_getServiceName: function() {
		return this.serviceName;
	},
	
	_setServiceName: function(serviceName) {
		this.serviceName = serviceName;
	},
		
	add: function(api, method, milliseconds) {
		var str = [];
		var obj = {};
		obj.api = api;
		obj.method = method;
		obj.milliseconds = ''+milliseconds;
		str.push(obj)
		this.apis.push(str);
	},

	emit: function() {
		var path = "/"+this.uri+"/"+this.referenceId+"/token/"+ this.token;		
		console.log('Ready to publish to: ' + this.server + path);
				
		var buffer = new Buffer(this.json());
		var bytes = buffer.toByteArray();
		
		var post_options = {
			host: this.server,
			//port: '8080',
			path: path,
			method: 'POST',
			headers: {
			    'Content-Type': 'application/json',
			    'Content-Length': Buffer.byteLength(bytes)
			}
		};
			
		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (res) {				
			    console.log('got a successful response');
			});
		});
			  
		post_req.on('error', function (err) {
			console.log('error during publishing: ' + err.message);
		});
		
		post_req.write(buffer);
		post_req.end();			 
				
		console.log('API stats published.');
	},		
	
	s: function(x) {
		return x.charCodeAt(0);
	},
	
	hostName: function() {
		return os.hostname();
	},
	
	json: function() {
		var arr = [];
		var _this = this;
		arr.push("[");
		var size = this.apis.length;
		
		while (size > 0) {
		 if (size != 0) {
			var v = [];
			v = this.apis.pop();			
			arr.push("{uri:\"" + v[0].api + "\", method: \"" + v[0].method +"\", duration: \"" + v[0].milliseconds +"\", service: \"" + _this._serviceName() +"\"}");
			size = this.apis.length;
			if (size > 0) {arr.push(",");}
		 }
		}
		arr.push("]");
		var json = arr.join("");
		console.log("JSON - " + json);

		return json;
	},
	
	run: function() {
		var _this = this;		
		//console.log('API Publish running - checking api length: ' + _this.apis.length);
		if (_this.apis.length > _this.threshold) {
			_this.emit();
		}									
	}
};