import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Grid, Typography, Box,
  Checkbox, FormControlLabel, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PageNavigation from './PageNavigation';
import MangaTile from './MangaTile';
import { setNSFW } from '../actions/settings';

const useStyles = makeStyles((theme) => ({
  searchInfo: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.only('xs')]: {
      flexDirection: 'column'
    },
    alignItems: 'center',
    marginBottom: 20,
  }
}));

const MangaGrid = ({ pageNavURL, page, totalPages, mangaList, nsfw, setNSFW }) => {
  const classes = useStyles();
  const [pageVal, setPageVal] = useState(page);
  const [inputFocused, setInputFocused] = useState(false);
  let history = useHistory();

  useEffect(() => {
    if (parseInt(pageVal) !== page && inputFocused === false) {
      history.push(`${pageNavURL}${pageVal}`);
    } 
  }, [inputFocused]);

  const mangaToDisplay = mangaList.map((manga) => {
    const { id } = manga;
    return (
      <Grid key={id} item xs={12} sm={6} lg={4} xl={3}>
        <MangaTile {...manga} />
      </Grid>
    )
  });

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
          <TextField
            style={{
              margin: '0 10px',
              maxWidth: 60,
            }}
            type="number"
            value={pageVal}
            onChange={(e) => setPageVal(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
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