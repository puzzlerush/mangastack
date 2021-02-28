import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../config/axios';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 200,
    width: '100%'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    minWidth: 150,
  }
}));

const SearchPage = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const searchQuery = query.get('q')
  useEffect(() => {
    const searchManga = async () => {
      const response = await axios.get('http://localhost:5000/manga/search', {
        params: { q: searchQuery }
      });
      setResults(response.data);

    };
    searchManga();
  }, [searchQuery]);

  const resultsToDisplay = results.map((result) => (
    <Grid item xs={12} sm={6} md={3}>
      <Card className={classes.root} elevation={10}>
        <CardMedia
          className={classes.cover}
          image={result.mainCover}
          title={`Cover for ${result.title}`}
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {result.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {Array.from(new Set(result.author.concat(result.artist))).join(', ')}
            </Typography>
            <Typography variant="body">
              {result.description ? (
                result.description.split(/\[.+?\]/)[0].slice(0, 150) + '...'
              ) : 'No synopsis available.'}
            </Typography>
          </CardContent>
        </div>
      </Card>
    </Grid>
  ))

  return (
    <>
      {results.length > 0 ? (
        <Grid
          container
          spacing={2}
          m={2}
        >
          {/* <Grid item xs="auto" sm={1} md={4} /> */}
            {resultsToDisplay}
          {/* <Grid item xs="auto" sm={1} md={4} /> */}
        </Grid>
      ) : (
          <div style={{ textAlign: 'center' }}>
            {searchQuery ? 'There are no results for the search.' : 'No query, no results.'}
          </div>
        )}
    </>
  );
};

export default SearchPage;