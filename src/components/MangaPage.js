import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';

const MangaPage = () => {
  const { id } = useParams();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>{id}</Grid>
    </Grid>
  );
};

export default MangaPage;