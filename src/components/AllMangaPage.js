import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Loader from './Loader';
import MangaGrid from './MangaGrid';
import { useResults } from '../hooks/mangadb-api';

const AllMangaPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const searchQuery = query.get('q');
  const page = parseInt(query.get('page')) || 1;
  const perPage = 12;

  

  return (
    <div>Hi!</div>
  );
};

const mapStateToProps = (state) => ({
  nsfw: state.settings.nsfw
});

export default connect(mapStateToProps)(AllMangaPage);