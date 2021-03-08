import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';
import MangaGrid from './MangaGrid';
import axios from '../config/axios';

const SearchPage = ({ nsfw }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const query = new URLSearchParams(useLocation().search);
  const searchQuery = query.get('q');
  const page = parseInt(query.get('page')) || 1;
  const perPage = 12;
  const totalPages = Math.ceil(count / perPage);
  useEffect(() => {
    const searchManga = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/mangadb/search`, {
          params: {
            q: searchQuery,
            nsfw,
            limit: perPage,
            skip: (page - 1) * perPage
          }
        });
        setResults(response.data.results);
        setCount(response.data.count);
      } catch (e) { }
      setIsLoading(false);
    };
    searchManga();
  }, [searchQuery, nsfw, page]);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <>
        {results.length > 0 ? (
          <MangaGrid
            pageNavURL={`/search?q=${searchQuery}&page=`}
            page={page}
            totalPages={totalPages}
            mangaList={results}
          />
        ) : (
            <div style={{ textAlign: 'center' }}>
              {searchQuery ? 'There are no results for the search.' : 'No query, no results.'}
            </div>
          )}
      </>
    );
  }
};

const mapStateToProps = (state) => ({
  nsfw: state.settings.nsfw
});

export default connect(mapStateToProps)(SearchPage);