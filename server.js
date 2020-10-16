const http = require('http');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const {ApolloServer, gql} = require('apollo-server');

const pages = [
  {
    title: 'Home',
    description: 'Home sweet home...',
  },
  {
    title: 'Contact',
    description: 'Get in touch!',
  },
];

// Define Apollo Server

const apolloServer = new ApolloServer({
  typeDefs: gql`
    type Post {
      title: String
      author: String
    }

    type Page {
      title: String
      description: String
    }

    type Query {
      posts: [Post]
      pages: [Page]
    }

    type Mutation {
      createPage(title: String!, description: String!): Page
    }
  `,
  resolvers: {
    Query: {
      posts: () => [
        {
          title: 'Hello, World!',
          author: 'Nathan Knowler',
        },
        {
          title: 'Building a Full Stack JavaScript Application',
          author: 'Nathan Knowler',
        },
      ],
      pages: () => pages,
    },
    Mutation: {
      createPage: (_, page) => pages[pages.push(page) - 1],
    },
  },
});

// Base HTML page

const html = `
<!doctype html>
<html lang="en-ca">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello, World!</title>
    <script src="/client.js" defer></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`.trim();

// Define App Server

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/':
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.write(html);
      res.end();
      break;
    default:
      fs.readFile(path.join('static', req.url), (err, data) => {
        if (err) {
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
});

// Compile assets

webpack(
  {
    mode: process.env.NODE_ENV,
    entry: {
      client: './client.js',
    },
    output: {
      path: path.resolve(__dirname, './static'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js/,
          use: 'babel-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
      }),
    ],
  },
  (err, stats) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(
      stats.toString({
        chunks: false,
        colors: true,
      })
    );

    // Start servers

    server.listen(8080, () => {
      console.log('\nServer running at http://localhost:8080/');
    });
    apolloServer.listen().then(({url}) => {
      console.log(`\nApollo Server running at ${url}`);
    });
  }
);
