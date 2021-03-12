import { connect } from 'react-redux';
import { useHistory, useLocation, Redirect } from 'react-router-dom';
import { Typography, Select } from '@material-ui/core';
import Loader from './Loader';
import MangaGrid from './MangaGrid';
import { useResults } from '../hooks/mangadb-api';
import { toQueryString } from '../utils/utils';

const AllMangaPage = ({ nsfw }) => {
  const query = new URLSearchParams(useLocation().search);
  const sortby = query.get('sortby') || 'views';
  const ascending = query.get('ascending') === 'true';
  const page = parseInt(query.get('page')) || 1;
  const perPage = 12;

  const [isLoading, results, count] = useResults('/mangadb', {
    sortby,
    ascending,
    nsfw,
    limit: perPage,
    skip: (page - 1) * perPage
  });

  const totalPages = Math.ceil(count / perPage);
  const pageNavURL = `/manga/all?${toQueryString({ sortby, ascending })}&page=`;

  let history = useHistory();
  if (isLoading) {
    return <Loader />;
  } else if (totalPages > 0 && page > totalPages) {
    return <Redirect to={pageNavURL + totalPages} />;
  } else {
    return (
      <div>
        <Typography component="div" align="center">
          {`Showing all manga sorted in `}
          <Select
            style={{ margin: '0 10px' }}
            native
            value={ascending}
            onChange={(e) => history.push(`/manga/all?${toQueryString({
              sortby,
              ascending: e.target.value,
              page
            })}`)}
          >
            <option value={true}>ascending</option>
            <option value={false}>descending</option>
          </Select>
          {` order by `}
          <Select
            style={{ margin: '0 10px' }}
            native
            value={sortby}
            onChange={(e) => history.push(`/manga/all?${toQueryString({
              sortby: e.target.value,
              ascending,
              page
            })}`)}
          >
            <option value="views">views</option>
            <option value="title">title</option>
            <option value="rating">rating</option>
          </Select>

        </Typography>
        <MangaGrid
          pageNavURL={pageNavURL}
          page={page}
          totalPages={totalPages}
          mangaList={results}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  nsfw: state.settings.nsfw
});

export default connect(mapStateToProps)(AllMangaPage);