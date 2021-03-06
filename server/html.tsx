import {renderToStaticMarkup} from 'react-dom/server';

const Html = () => (
  <html lang="en-ca">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Hello, World!</title>
      <script src="/main.js" defer />
    </head>
    <body>
      <div id="root" />
    </body>
  </html>
);

export const html = `<!doctype html>${renderToStaticMarkup(<Html />)}`;
