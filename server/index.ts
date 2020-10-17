import {createServer} from 'http';
import {readFile} from 'fs';
import path from 'path';
import mime from 'mime-types';
import {ApolloServer, gql} from 'apollo-server';

import {html} from './html';

const posts = [
  {
    id: 0,
    title: 'Hello, World!',
    author: 'Nathan Knowler',
  },
];

const apolloServer = new ApolloServer({
  typeDefs: gql`
    type Post {
      id: ID!
      title: String
      author: String
    }

    type Query {
      posts: [Post]
    }

    type Mutation {
      createPost(title: String, author: String): Post
    }
  `,
  resolvers: {
    Query: {
      posts: () => posts,
    },
    Mutation: {
      createPost: (_, post) => {
        const id = posts.length;

        posts.push({id, ...post});

        return posts[id];
      },
    },
  },
});

const server = createServer((req, res) => {
  switch (req.url) {
    case '/': {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(html);
      res.end();
      break;
    }
    default: {
      const contentType = mime.lookup(req.url);

      if (!contentType) {
        console.error('Bad mime type');
        res.writeHead(415);
        res.end();
      }

      readFile(path.resolve(__dirname, '..', 'client', req.url.replace(/^\//, '')), (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(404);
          return res.end();
        }

        res.writeHead(200, {
          'Content-Type': contentType as string,
          'X-Content-Type-Options': 'nosniff',
        });
        res.write(data);
        return res.end();
      });

      break;
    }
  }
});

server.listen(8080, () => {
  console.log(`Server running at http://localhost:8080/`);
});

apolloServer.listen().then(({url}) => {
  console.log(`Apollo server running at ${url}`);
});
