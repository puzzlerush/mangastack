import { useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../config/axios';
import Loader from './Loader';

const useStyles = makeStyles((theme) => ({
  siteTitle: {
    fontSize: '3em',
    fontWeight: 300,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    marginBottom: 22
  }
}));

const HomePage = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [popularManga, setPopularManga] = useState([]);

  useEffect(() => {
    const fetchPopularManga = async () => {
      setIsLoading(true);
      const response = await axios.get('/mangadb', {
        params: {
          sortby: 'views',
          ascending: false,
          limit: 4,
          skip: 0
        }
      });
      setPopularManga(response.data);
      setIsLoading(false);
    };
    fetchPopularManga();
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div style={{ textAlign: 'center' }}>
        <Typography className={classes.siteTitle} variant="h1">
          Manga Stack
        </Typography>
        <Divider />
      </div>
    );
  }
};

export default HomePage;