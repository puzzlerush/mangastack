import { connect } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Loader from './Loader';
import MangaGrid from './MangaGrid';
import { useResults } from '../hooks/mangadb-api';

const SearchPage = ({ nsfw }) => {
  const query = new URLSearchParams(useLocation().search);
  const searchQuery = query.get('q');
  const page = parseInt(query.get('page')) || 1;
  const perPage = 12;

  const [isLoading, results, count] = useResults('/mangadb/search', {
    q: searchQuery,
    nsfw,
    limit: perPage,
    skip: (page - 1) * perPage
  });

  const totalPages = Math.ceil(count / perPage);
  const pageNavURL = `/search?q=${searchQuery}&page=`;

  if (isLoading) {
    return <Loader />;
  } else if (totalPages > 0 && page > totalPages) {
    return <Redirect to={pageNavURL + totalPages} />;
  } else {
    return (
      <div>
        {results.length > 0 ? (
          <>
            <Helmet>
              <title>Search - MangaStack</title>
              <meta
                name="keywords"
                content={results.map((result) => result.title).join(', ')}
              />
            </Helmet>
            <Typography align="center">
              {`Showing search results for "${searchQuery}"`}
            </Typography>
            <MangaGrid
              pageNavURL={pageNavURL}
              page={page}
              totalPages={totalPages}
              mangaList={results}
            />
          </>
        ) : (
            <Typography align="center">
              {searchQuery ? 'There are no results for the search.' : 'No query, no results.'}
            </Typography>
          )}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  nsfw: state.settings.nsfw
});

export default connect(mapStateToProps)(SearchPage);