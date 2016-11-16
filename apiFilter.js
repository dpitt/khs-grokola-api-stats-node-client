var filterConfig = require('./filterConfig');
var ApiPublish = require('./apiPublish');

module.exports = {		
		apiPattern : "/sherpa/.*",
		serviceName: undefined,
		apiServer: undefined,
		valid: false,
		token: undefined,
		referenceId: -1,
		watchThreshold: 10,
			
		initialize: function() {
			this.apiPattern = filterConfig.apiPattern;
			this.serviceName = filterConfig.serviceName;
			this.apiServer = filterConfig.grokolaServer;
			this.token = filterConfig.token;
			var threshold = filterConfig.watchThreshold;
			var refid = filterConfig.referenceId;
			
			if (threshold != undefined && threshold != "") {				
				this.watchThreshold = parseInt(threshold) || 0;				
			} else {
				console.log('WARNING: Watch threshold must be an integer');
			}
			
			if (this.token == "" || this.token == undefined) {
				console.log('ERROR: Integration token required for API filter to be enabled...');
			}
			
			if (refid == "" || refid == undefined) {
				console.log('ERROR: Grokola Reference Id must be defined...');
			} else {
				this.referenceId = parseInt(refid);
			}
			
			if (this.apiServer == "" || this.apiServer == undefined) {
				console.log("ERROR: Server must be specified in filterConfig... Api's will not be watched.");
			}
			
			// mark true if api watch filter has a valid configuration
			this.valid = this.apiServer != undefined && this.referenceId >= 0 && this.token != undefined;	
			console.log('API Filter initialization complete.');
		},
		
		doFilter: function(req, resp) {					
			var method = req.method;
			var uri = req.url;
			
			ApiPublish._setServiceName(this.serviceName);			
			ApiPublish._setServer(this.apiServer);
			ApiPublish._setReferenceId(this.referenceId);
			ApiPublish._setThreshold(this.watchThreshold);
			ApiPublish._setToken(this.token);
			ApiPublish.run();
			console.log("API Watch started, will publish API's for every " + this.watchThreshold + " encounters... ");
			
			var start = new Date().getTime();
						
			if (uri.match(this.apiPattern) && this.valid) {					
				ApiPublish.add(uri, method, new Date().getTime() - start);
			}
		}
};