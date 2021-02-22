import { useParams } from 'react-router-dom';
import {
  Grid, Card, CardContent,
  CardMedia, Typography, Divider,
  Accordion, AccordionSummary, AccordionDetails
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Alert, AlertTitle, Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import Loader from './Loader'
import ChapterList from './ChapterList';
import { useMangaData } from '../hooks/mangadex-api';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: 600
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    maxWidth: 700
  },
  cover: {
    [theme.breakpoints.only('xs')]: {
      width: 0
    },
    [theme.breakpoints.only('sm')]: {
      width: 200
    },
    width: 450
  },
  accordion: {
    maxWidth: '100%'
  }
}));

const MangaPage = () => {
  const classes = useStyles();

  const { id } = useParams();

  const { isLoading, error, mangaInfo, chapters } = useMangaData(id);
  if (isLoading) {
    return <Loader />
  } else if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  } else {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs="auto" sm={1} md={4} />
        <Grid item xs={12} sm={10} md={8}>
          <Card className={classes.root} elevation={10}>
            <CardMedia
              className={classes.cover}
              image={mangaInfo.image_url}
              title={mangaInfo.title}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography variant="h5">{mangaInfo.title}</Typography>
                <Rating defaultValue={mangaInfo.score/2} precision={0.5} readOnly />
                <Divider />
                <br />
                <Typography variant="subtitle1">{`${chapters.length} chapters`}</Typography>
                <br />
                <Typography variant="subtitle1">
                  {mangaInfo.publishing ? 'Publishing from ' : 'Published from '}
                  {mangaInfo.published && mangaInfo.published.string}
                </Typography>
                <br />
                <Accordion className={classes.accordion}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="synopsis-content"
                    id="synopsis-header"
                  >
                    <Typography variant="subtitle1">Synopsis</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {mangaInfo.synopsis ? mangaInfo.synopsis : 'No synopsis available.'}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <br />
        <Grid item xs="auto" sm={1} md={4} />
        <Grid item xs="auto" sm={1} md={4} />
        <Grid item xs={12} sm={10} md={8}>
          <ChapterList chapters={chapters} />
        </Grid>
        <Grid item xs="auto" sm={1} md={4} />
        <br />
      </Grid>
    );
  }
};

export default MangaPage;