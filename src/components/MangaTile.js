import { Link } from 'react-router-dom';
import {
  Typography, Card, CardContent,
  CardMedia, CardActionArea
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Rating } from '@material-ui/lab';
import { htmlDecode } from '../utils/utils';

export const getShortText = (description, cutoff) => {
  const split = htmlDecode(description).replace(/\[.*?\]/g, '');
  if (split.length <= cutoff) {
    return split;
  } else {
    return split.slice(0, cutoff) + '...';
  }
};

export const getShortAuthors = (author, artist) => {
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

const MangaTile = ({ id, title, artist, author, description, rating, views, mainCover }) => {
  const classes = useStyles();
  return (
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
              {getShortText(title, 50)}
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
  );
};

export default MangaTile;