import ReactDOM from 'react-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';

import {Pages, Posts} from './components';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <Posts />
      <Pages />
    </div>
  </ApolloProvider>,
  document.getElementById('root')
);
