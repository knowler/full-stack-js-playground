import {gql, useQuery} from '@apollo/client';

import {ErrorMessage} from './ErrorMessage';
import {Loading} from './Loading';

const PAGES = gql`
  query {
    pages {
      title
      description
    }
  }
`;

export function Pages() {
  const {loading, error, data, refetch} = useQuery(PAGES);

  return (
    <div style={{width: '50vw'}}>
      <h1>Pages</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage />
      ) : data.pages ? (
        <>
          <ul>
            {data.pages.map((page) => (
              <li key={page.title}>
                <article>
                  <header>
                    <h2>{page.title}</h2>
                  </header>
                  <p>{page.description}</p>
                </article>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => refetch()}>
            Load more
          </button>
        </>
      ) : (
        <>
          <p>No pages found. Come again.</p>
          <button type="button" onClick={() => refetch()}>
            Retry
          </button>
        </>
      )}
    </div>
  );
}
