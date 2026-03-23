import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Typography, Divider, Grid, Box, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Loader from './Loader';
import MangaTile from './MangaTile';
import { useMangaList } from '../hooks/mangadex-api';

const useStyles = makeStyles((theme) => ({
  allcaps: {
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
  },
  siteTitle: {
    fontSize: '3em',
    [theme.breakpoints.only('xs')]: {
      fontSize: '2.2em',
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: '2.5em',
    },
  },
  subtitle: {
    margin: '15px 0',
  },
  divider: {
    margin: '22px 0',
  },
}));

const MangaSection = ({ title, mangaList, isLoading, error, classes }) => {
  const tiles = mangaList.map((manga) => (
    <Grid key={manga.id} item xs={12} sm={6} lg={3}>
      <MangaTile {...manga} />
    </Grid>
  ));

  return (
    <Box mb={7}>
      <Typography className={clsx(classes.subtitle, classes.allcaps)} variant="h6">
        {title}
      </Typography>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={2} m={2}>
          {tiles}
        </Grid>
      )}
    </Box>
  );
};

const HomePage = ({ language }) => {
  const classes = useStyles();

  const { isLoading: recLoading, error: recError, mangaList: recommended } =
    useMangaList({ followedCount: 'desc' }, language);
  const { isLoading: newLoading, error: newError, mangaList: recentlyAdded } =
    useMangaList({ createdAt: 'desc' }, language);

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
            margin: 'auto',
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
        <MangaSection
          title="Recommended"
          mangaList={recommended}
          isLoading={recLoading}
          error={recError}
          classes={classes}
        />
        <MangaSection
          title="Recently Added"
          mangaList={recentlyAdded}
          isLoading={newLoading}
          error={newError}
          classes={classes}
        />
      </Box>
    </div>
  );
};

const mapStateToProps = (state) => ({
  language: state.settings.language,
});

export default connect(mapStateToProps)(HomePage);
