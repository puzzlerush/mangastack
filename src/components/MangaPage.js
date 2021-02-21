import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../config/axios';
import Loader from './Loader'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 600
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 450
  },
}));

const MangaPage = () => {
  const classes = useStyles();

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [mangaInfo, setMangaInfo] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await axios.get(`/manga/${id}`);
      setMangaInfo(response.data.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    isLoading ? (
      <Loader />
    ) : (
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
                image={mangaInfo.mainCover}
                title={mangaInfo.title}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="h5">{mangaInfo.title}</Typography>
                </CardContent>
              </div>
            </Card>
          </Grid>
          <Grid item xs="auto" sm={1} md={4} />
        </Grid>
      )
  );
};

export default MangaPage;