import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation, useHistory, Link } from 'react-router-dom';
import {
  Grid, Typography, Box,
  Card, CardContent, CardMedia, CardActionArea,
  Checkbox, FormControlLabel, Select
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import PageNavigation from './PageNavigation';
import Loader from './Loader';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';
import { setNSFW } from '../actions/settings';

const getShortDescription = (description) => {
  const cutoff = 150;
  const split = htmlDecode(description).replace(/\[.*?\]/g, '');
  if (split.length <= cutoff) {
    return split;
  } else {
    return split.slice(0, cutoff) + '...';
  }
};

const getShortAuthors = (author, artist) => {
  const cutoff = 30
  const authors = htmlDecode(Array.from(new Set(author.concat(artist))).join(', '));
  if (authors.length <= cutoff) {
    return authors;
  } else {
    return authors.slice(0, cutoff) + '...';
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 300,
    width: '100%'
  },
  searchInfo: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    },
    alignItems: 'center',
    marginBottom: 20,
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
    [theme.breakpoints.only('xs')]: {
      minWidth: 50
    },
    [theme.breakpoints.only('sm')]: {
      minWidth: 100
    }
  }
}));

const SearchPage = ({ nsfw, setNSFW }) => {
  const classes = useStyles();
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

  const resultsToDisplay = results.map((result) => (
    <Grid key={result.id} item xs={12} sm={6} lg={4} xl={3}>
      <Card className={classes.root} elevation={10}>
        <CardActionArea>
          <Link to={`/manga/${result.id}`}>
            <CardMedia
              component="img"
              height={300}
              className={classes.cover}
              image={result.mainCover}
              title={`Cover for ${result.title}`}
            />
          </Link>
        </CardActionArea>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Link
              to={`/manga/${result.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <Typography component="h6" variant="h6">
                {htmlDecode(result.title)}
              </Typography>
            </Link>
            <Rating value={result.rating.bayesian / 2} precision={0.5} readOnly />
            <Typography>
              {result.views.toLocaleString()} views
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {getShortAuthors(result.author, result.artist)}
            </Typography>
            <Typography variant="body2">
              {getShortDescription(result.description) || 'No synopsis available.'}
            </Typography>
          </CardContent>
        </div>
      </Card>
    </Grid>
  ))

  let history = useHistory();
  if (isLoading) {
    return <Loader />;
  } else {
    const pageNavURL = `/search?q=${searchQuery}&page=`;
    const pageNavOptions = Object.keys([...Array(totalPages)])
      .map((key) => parseInt(key) + 1)
      .map((pageNum) => (
        <option
          key={`page-${pageNum}`}
          value={pageNum}
        >
          {pageNum}
        </option>
      ))
    return (
      <>
        {results.length > 0 ? (
          <Box p={2}>
            <PageNavigation
              prevLink={`${pageNavURL}${page - 1}`}
              nextLink={`${pageNavURL}${page + 1}`}
              disablePrev={page <= 1}
              disableNext={page >= totalPages}
            />
            <div className={classes.searchInfo}>
              <Typography
                component="span"
                variant="body1"
                style={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {`Page `}
                <Select
                  style={{
                    margin: '0 10px'
                  }}
                  native
                  value={page}
                  onChange={(e) => history.push(`${pageNavURL}${e.target.value}`)}
                >
                  {pageNavOptions}
                </Select>
                {` of ${totalPages}`}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={nsfw}
                    onChange={() => setNSFW(!nsfw)}
                    name="include-nsfw-checkbox"
                  />
                }
                label="Include NSFW results"
              />
            </div>
            <Grid
              container
              spacing={2}
              m={2}
            >
              {resultsToDisplay}
            </Grid>
            <div style={{ margin: '60px 0 80px 0' }}>
              <PageNavigation
                topOfPage={false}
                prevLink={`${pageNavURL}${page - 1}`}
                nextLink={`${pageNavURL}${page + 1}`}
                disablePrev={page <= 1}
                disableNext={page >= totalPages}
              />
            </div>
          </Box>
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

const mapDispatchToProps = (dispatch) => ({
  setNSFW: (nsfw) => dispatch(setNSFW(nsfw))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);