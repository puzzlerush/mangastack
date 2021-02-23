import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ChapterList from './ChapterList';
import { useMangaData } from '../hooks/mangadex-api';
import axios from '../config/axios';

const ReadChapterPage = () => {
  const { id, chapterNumber } = useParams();
  const { chapters } = useMangaData(id);
  
  
  const [pages, setPages] = useState([]);
  useEffect(() => {
    const fetchChapter = async () => {
      if (chapters.length === 0) {
        return;
      }
      const { hash: chapterHash } = chapters.find((chapter) => chapter.chapter === chapterNumber);
      const response = await axios.get(`/chapter/${chapterHash}`);
      const { pages: pageImages, server } = response.data.data;
      const pageURLs = pageImages.map((pageImage) => `${server}${chapterHash}/${pageImage}`);
      console.log(pageURLs);
      setPages(pageURLs);
    };

    fetchChapter();
  }, [chapters])
  
  const pagesToDisplay = pages.map((page) => <img key={page} src={page} />)
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item xs="auto" sm={1} md={4} />
      <Grid item xs={12} sm={10} md={8}>
        <ChapterList chapters={chapters} />
        {pagesToDisplay}
      </Grid>
      <Grid item xs="auto" sm={1} md={4} />
    </Grid>

  );
};

export default ReadChapterPage;