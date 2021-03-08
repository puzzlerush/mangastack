import { useState, useEffect } from 'react';
import { Typography, Divider, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from '../config/axios';
import Loader from './Loader';
import MangaTile from './MangaTile';

const useStyles = makeStyles((theme) => ({
  allcaps: {
    textTransform: 'uppercase',
    letterSpacing: '0.2em'
  },
  siteTitle: {
    fontSize: '3em',
    fontWeight: 300
  },
  subtitle: {
    margin: '15px 0'
  },
  divider: {
    margin: '22px 0'
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

  const popularMangaToDisplay = popularManga.map((manga) => {
    const { id } = manga;
    return (
      <Grid key={id} item xs={12} sm={6} lg={4} xl={3}>
        <MangaTile {...manga} />
      </Grid>
    );
  });

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div>
        <Typography 
          className={clsx(classes.siteTitle, classes.allcaps)} 
          variant="h1" 
          align="center"
        >
          Manga Stack
        </Typography>
        <Typography 
          className={clsx(classes.subtitle, classes.allcaps)} 
          variant="subtitle1" 
          align="center"
        >
          Read over 50,000 manga, webtoons, and comics for free!
        </Typography>
        <Divider className={classes.divider} />
        <Box p={2}>
          <Typography 
            className={clsx(classes.subtitle, classes.allcaps)}
            variant="h5">
            Most Popular Manga
          </Typography>
          <Grid
            container
            spacing={2}
            m={2}
          >
            {popularMangaToDisplay}
          </Grid>
        </Box>

      </div>
    );
  }
};

export default HomePage;