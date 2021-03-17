import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Divider, Grid, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import axios from '../config/axios';
import Loader from './Loader';
import MangaTile from './MangaTile';
import popularManga from '../assets/popularManga';
import topRatedManga from '../assets/topRatedManga';

const useStyles = makeStyles((theme) => ({
  allcaps: {
    textTransform: 'uppercase',
    letterSpacing: '0.2em'
  },
  siteTitle: {
    fontSize: '3em',
    [theme.breakpoints.only('xs')]: {
      fontSize: '2.2em'
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: '2.5em'
    }
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

  // For now, hard code the featured manga to display to improve SEO
  const isLoading = false;

  // const [isLoading, setIsLoading] = useState(true);
  // const [popularManga, setPopularManga] = useState([]);

  // useEffect(() => {
  //   const fetchPopularManga = async () => {
  //     setIsLoading(true);
  //     const response = await axios.get('/mangadb', {
  //       params: {
  //         sortby: 'views',
  //         ascending: false,
  //         limit: 4,
  //         skip: 0
  //       }
  //     });
  //     setPopularManga(response.data);
  //     setIsLoading(false);
  //   };
  //   fetchPopularManga();
  // }, []);

  const popularMangaToDisplay = popularManga.map((manga) => {
    const { id } = manga;
    return (
      <Grid key={id} item xs={12} sm={6} lg={3}>
        <MangaTile {...manga} />
      </Grid>
    );
  });

  const topRatedMangaToDisplay = topRatedManga.slice(0, 4).map((manga) => {
    const { id } = manga;
    return (
      <Grid key={id} item xs={12} sm={6} lg={3}>
        <MangaTile {...manga} />
      </Grid>
    );
  });

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div>
        <Box p={2}>
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
            Mobile friendly reader for MangaDex
        </Typography>
          <Divider className={classes.divider} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              maxWidth: 400,
              margin: 'auto'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/manga/all"
              fullWidth
            >
              View All Manga
            </Button>
          </div>
          <Box mb={7}>
            <Typography
              className={clsx(classes.subtitle, classes.allcaps)}
              variant="h6"
            >
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
          <Box mb={7}>
            <Typography
              className={clsx(classes.subtitle, classes.allcaps)}
              variant="h6"
            >
              Top Rated Manga
          </Typography>
            <Grid
              container
              spacing={2}
              m={2}
            >
              {topRatedMangaToDisplay}
            </Grid>
          </Box>
        </Box>

      </div>
    );
  }
};

export default HomePage;