import {useEffect} from 'react';
import {gql, useMutation, useQuery, NetworkStatus} from '@apollo/client';

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

const CREATE_PAGE = gql`
  mutation CreatePage($title: String!, $description: String!) {
    createPage(title: $title, description: $description) {
      title
      description
    }
  }
`;

function CreatePageForm() {
  const [createPage] = useMutation(CREATE_PAGE);

  const handleSubmit = (event) => {
    event.preventDefault();

    createPage({
      variables: {
        title: event.target.elements.namedItem('title').value,
        description: event.target.elements.namedItem('description').value,
      },
    });

    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} method="POST" action="/">
      <h2>Create New Page</h2>
      <div>
        <label htmlFor="new-page-title" style={{display: 'block'}}>
          Title
        </label>
        <input type="text" name="title" id="new-page-title" />
      </div>
      <div>
        <label htmlFor="new-page-description" style={{display: 'block'}}>
          Description
        </label>
        <textarea name="description" id="new-page-description"></textarea>
      </div>
      <button type="submit">Create Page</button>
    </form>
  );
}

export function Pages() {
  const {error, data, refetch, networkStatus} = useQuery(PAGES, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    console.info(networkStatus, NetworkStatus);
  }, [networkStatus]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <div style={{position: 'relative', width: '50vw'}}>
      <h1>Pages</h1>
      {networkStatus === NetworkStatus.loading ? (
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
      <CreatePageForm />
      {networkStatus === NetworkStatus.refetch && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: 'black',
            color: 'white',
            padding: '1rem',
          }}
        >
          Refetching!
        </div>
      )}
      {networkStatus === NetworkStatus.poll && (
        <div
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: 'black',
            color: 'white',
            padding: '1rem',
          }}
        >
          Polling!
        </div>
      )}
    </div>
  );
}
