import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Grid, Typography,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { deleteItem } from '../actions/mangaList';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  title: {
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center'
    }
  },
  list: {
    width: '100%'
  }
}));

const CurrentlyReadingPage = ({ mangaList, deleteItem }) => {
  const classes = useStyles();

  const mangaListEntries = mangaList.map(({ mangaInfo, chapterInfo }) => {
    const title = chapterInfo.mangaTitle;
    const chapterName =
      `${chapterInfo.chapter && `Chapter ${chapterInfo.chapter}`}
       ${chapterInfo.chapter && chapterInfo.title && ' - '}
       ${chapterInfo.title}`;
    const chapterLink = `/manga/${mangaInfo.id}/chapter/${chapterInfo.id}`;
    return (
      <ListItem
        key={mangaInfo.id}
        button
        component={Link}
        to={chapterLink}
      >
        <ListItemText
          primary={title}
          secondary={`Last opened: ${chapterName}`}
        />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteItem(mangaInfo.id)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  })
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs="auto" sm={1} md={2} />
      <Grid item xs={12} sm={10} md={8}>
        <Typography variant="h4" className={classes.title}>
          Currently Reading
        </Typography>
        <br />
        {mangaListEntries.length > 0 ? (
          <List>
            {mangaListEntries}
          </List>
        ) : (
            <Typography variant="body1">
              You are not reading any manga right now.
            </Typography>
          )}
      </Grid>
      <Grid item xs="auto" sm={1} md={2} />
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  mangaList: state.mangaList
});

const mapDispatchToProps = (dispatch) => ({
  deleteItem: (mangaId) => dispatch(deleteItem(mangaId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentlyReadingPage);