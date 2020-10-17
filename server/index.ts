import {createServer} from 'http';
import {readFile} from 'fs';
import path from 'path';

import {html} from './html'

const server = createServer((req, res) => {
  switch (req.url) {
    case '/': {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(html);
      res.end();
      break;
    }
    default: {
      readFile(path.resolve(__dirname, '..', 'client', req.url.replace(/^\//, '')), (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(404);
          return res.end();
        }

        res.writeHead(200, {
          'Content-Type': 'application/javascript',
          'X-Content-Type-Options': 'nosniff',
        });
        res.write(data);
        return res.end();
      });

      break;
    }
  }
});

server.listen(8080);
