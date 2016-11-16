# khs-grokola-api-stats-node-client
GrokOla Api Watch client for Node.js

Installation
_______________________________________________________________

This client uses Node.js in its simplest form outside of any Node js framework (ex Express).  This allows it to integrate seamlessly with any current Node implementation. Therefore, importing the included modules is really at the discretion of the developer.  For basic illustrative purposes and to keep it simple, modify the export module your createServer function expects inside your app.js so as to read every http request to your server.  Include a call to the initialize function of the apiFilter module followed by the doFilter function of the same apiFilter:

```javascript
var apiFilter = require('./apiFilter');

module.exports = {
		handleRequest: function(request, response) {			
			  apiFilter.initialize();
			  apiFilter.doFilter(request, response);
			  var path = url.parse(request.url);
			  switch (path.pathname) {
				  case '/':
				    console.log('main page');
				  break;
					  renderHTML('///');
				  case '/login':
					  console.log('login');
					  break;
				  default:
					  response.writeHead(404);
					  response.write('Path not defined');
					  response.end();
			  }
		}
}
```

Then include the following js files in the same directory as your app.js.  (This can be moved to other directories as necessary keeping in mind modifying the 'require' imports as applicable).
- apiFilter.js
- filterConfig.js
- apiPublish.js
