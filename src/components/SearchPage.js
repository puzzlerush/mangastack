import { connect } from 'react-redux';
import { useLocation, Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Loader from './Loader';
import MangaGrid from './MangaGrid';
import { useMangaList } from '../hooks/mangadex-api';
import { getContentRating } from '../utils/utils';

const SearchPage = ({ nsfw, language }) => {
  const query = new URLSearchParams(useLocation().search);
  const searchQuery = query.get('q');
  const page = parseInt(query.get('page')) || 1;
  const perPage = 12;

  const contentRating = getContentRating(nsfw);

  const { isLoading, mangaList, total } = useMangaList(
    { relevance: 'desc' },
    language,
    {
      limit: perPage,
      offset: (page - 1) * perPage,
      contentRating,
      title: searchQuery,
    }
  );

  const totalPages = Math.ceil(total / perPage);
  const pageNavURL = `/search?q=${searchQuery}&page=`;

  if (isLoading) {
    return <Loader />;
  } else if (totalPages > 0 && page > totalPages) {
    return <Redirect to={pageNavURL + totalPages} />;
  } else {
    return (
      <div>
        {mangaList.length > 0 ? (
          <>
            <Helmet>
              <title>Search - MangaStack</title>
              <meta
                name="keywords"
                content={mangaList.map((manga) => manga.title).join(', ')}
              />
            </Helmet>
            <Typography align="center">
              {`Showing search results for "${searchQuery}"`}
            </Typography>
            <MangaGrid
              pageNavURL={pageNavURL}
              page={page}
              totalPages={totalPages}
              mangaList={mangaList}
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
  nsfw: state.settings.nsfw,
  language: state.settings.language,
});

export default connect(mapStateToProps)(SearchPage);
