process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // Cause index.js to be executed *again* but
  // in child mode
  cluster.fork();
} else {
  // Im a child, I'm going to act like a server
  // and do nothing else
  const express = require('express');
  const crypto = require('crypto');
  const app = express();

  app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('Hi there');
    });
  });

  app.get('/fast', (req, res) => {
    res.send('This was fast!');
  });

  app.listen(3000);
}

/* 
    Remember the core limit per computer. Although we were able
    to address all the incoming requests at the same time to the
    CPU, the net result was that our overall perfomance suffered
    because our CPU was trying to bounce around and process all 
    these different incoming requests at exactly the same time.

    So this is a very clear case where we have kind of over
    allocated instances inside of our cluster.
*/
