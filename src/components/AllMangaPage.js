import { connect } from 'react-redux';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { Typography, Select } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Loader from './Loader';
import MangaGrid from './MangaGrid';
import { useMangaList } from '../hooks/mangadex-api';
import { toQueryString, getContentRating } from '../utils/utils';

const SORT_KEY_MAP = {
  views: 'followedCount',
  title: 'title',
  rating: 'rating',
};

const AllMangaPage = ({ nsfw, language }) => {
  const query = new URLSearchParams(useLocation().search);
  const sortby = query.get('sortby') || 'views';
  const ascending = query.get('ascending') === 'true';
  const page = parseInt(query.get('page')) || 1;
  const perPage = 12;

  const order = { [SORT_KEY_MAP[sortby] || 'followedCount']: ascending ? 'asc' : 'desc' };
  const contentRating = getContentRating(nsfw);

  const { isLoading, mangaList, total } = useMangaList(order, language, {
    limit: perPage,
    offset: (page - 1) * perPage,
    contentRating,
  });

  const totalPages = Math.ceil(total / perPage);
  const pageNavURL = `/manga/all?${toQueryString({ sortby, ascending })}&page=`;

  let history = useHistory();
  if (isLoading) {
    return <Loader />;
  } else if (totalPages > 0 && page > totalPages) {
    return <Redirect to={pageNavURL + totalPages} />;
  } else {
    return (
      <div>
        <Helmet>
          <title>All Manga - MangaStack</title>
          <meta
            name="keywords"
            content={mangaList.map((manga) => manga.title).join(', ')}
          />
        </Helmet>
        <Typography component="div" align="center">
          {`Showing all manga sorted in `}
          <Select
            style={{ margin: '0 10px' }}
            native
            value={ascending}
            onChange={(e) =>
              history.push(
                `/manga/all?${toQueryString({ sortby, ascending: e.target.value, page })}`
              )
            }
          >
            <option value={true}>ascending</option>
            <option value={false}>descending</option>
          </Select>
          {` order by `}
          <Select
            style={{ margin: '0 10px' }}
            native
            value={sortby}
            onChange={(e) =>
              history.push(
                `/manga/all?${toQueryString({ sortby: e.target.value, ascending, page })}`
              )
            }
          >
            <option value="views">popularity</option>
            <option value="title">title</option>
            <option value="rating">rating</option>
          </Select>
        </Typography>
        <MangaGrid
          pageNavURL={pageNavURL}
          page={page}
          totalPages={totalPages}
          mangaList={mangaList}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  nsfw: state.settings.nsfw,
  language: state.settings.language,
});

export default connect(mapStateToProps)(AllMangaPage);
