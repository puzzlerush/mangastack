import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
  Grid, Typography, Box,
  Card, CardContent, CardMedia, CardActionArea,
  Checkbox, FormControlLabel, Select
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import PageNavigation from './PageNavigation';
import { htmlDecode } from '../utils/utils';
import { setNSFW } from '../actions/settings';

const getShortText = (description, cutoff) => {
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

const MangaGrid = ({ pageNavURL, page, totalPages, mangaList, nsfw, setNSFW }) => {
  const classes = useStyles();

  const mangaToDisplay = mangaList.map((manga) => {
    const { id, title, artist, author, description, rating, views, mainCover } = manga;
    return (
      <Grid key={id} item xs={12} sm={6} lg={4} xl={3}>
        <Card className={classes.root} elevation={10}>
          <CardActionArea>
            <Link to={`/manga/${id}`}>
              <CardMedia
                component="img"
                height={300}
                className={classes.cover}
                image={mainCover}
                title={`Cover for ${title}`}
              />
            </Link>
          </CardActionArea>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Link
                to={`/manga/${id}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Typography component="h6" variant="h6">
                  {getShortText(title, 75)}
                </Typography>
              </Link>
              <Rating value={rating.bayesian / 2} precision={0.5} readOnly />
              <Typography>
                {views.toLocaleString()} views
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {getShortAuthors(author, artist)}
              </Typography>
              <Typography variant="body2">
                {getShortText(description, 150) || 'No synopsis available.'}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </Grid>
    )
  });

  const pageNavOptions = Object.keys([...Array(totalPages)])
    .map((key) => parseInt(key) + 1)
    .map((pageNum) => (
      <option
        key={`page-${pageNum}`}
        value={pageNum}
      >
        {pageNum}
      </option>
    ));

  let history = useHistory();
  return (
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
        {mangaToDisplay}
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
  );
};

const mapStateToProps = (state) => ({
  nsfw: state.settings.nsfw
});

const mapDispatchToProps = (dispatch) => ({
  setNSFW: (nsfw) => dispatch(setNSFW(nsfw))
});

export default connect(mapStateToProps, mapDispatchToProps)(MangaGrid);