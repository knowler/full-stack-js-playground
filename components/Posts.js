import {gql, useQuery} from '@apollo/client';

const POSTS = gql`
  query {
    posts {
      title
      author
    }
  }
`;

export function Posts() {
  const {loading, error, data} = useQuery(POSTS);

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return 'Oops... we hit a snag!';
  }

  return (
    <div style={{width: '50vw'}}>
      <h1>Posts</h1>
      {data.posts ? (
        <ul>
          {data.posts.map((post) => (
            <li key={post.title}>
              <article>
                <header>
                  <h2>{post.title}</h2>
                  <p>by {post.author}</p>
                </header>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found. Come again.</p>
      )}
    </div>
  );
}
