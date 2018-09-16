 const http = require('http');
 const app = require('./app');
 
 const port = process.env.PORT || 3001;

 var server = http.createServer(app);

 server.listen(port , () => {
   console.log(`server is up and running on port: ${port}`);
 });
