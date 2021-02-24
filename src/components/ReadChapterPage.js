import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Typography, List, ListItem, Button } from '@material-ui/core';
import ChapterList from './ChapterList';
import { useMangaData } from '../hooks/mangadex-api';
import axios from '../config/axios';

const ReadChapterPage = () => {
  const { id, chapterNumber } = useParams();
  const { mangaInfo, chapters } = useMangaData(id);

  const [title, setTitle] = useState('')
  const [pages, setPages] = useState([]);
  const [prevChapter, setPrevChapter] = useState('');
  const [nextChapter, setNextChapter] = useState('');
  useEffect(() => {
    const fetchChapter = async () => {
      if (chapters.length === 0) {
        return;
      }
      const chapterIndex = chapters.findIndex((chapter) => chapter.chapter === chapterNumber);
      setPrevChapter(chapters[chapterIndex < chapters.length ? chapterIndex + 1 : ''].chapter);
      setNextChapter(chapters[chapterIndex > 0 ? chapterIndex - 1 : ''].chapter);
      const { title, hash: chapterHash } = chapters[chapterIndex];
      setTitle(title);
      const response = await axios.get(`/chapter/${chapterHash}`);
      const { pages: pageImages, server } = response.data.data;
      const pageURLs = pageImages.map((pageImage) => `${server}${chapterHash}/${pageImage}`);
      setPages(pageURLs);
    };

    fetchChapter();
  }, [chapters, chapterNumber])

  const pagesToDisplay = pages.map((page, index) => (
    <ListItem key={page}>
      <img style={{ width: '100%' }} src={page} alt={`Error loading page ${index + 1}`} />
    </ListItem>

  ));

  let history = useHistory();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item xs="auto" sm={1} md={4} />
      <Grid item xs={12} sm={10} md={8}>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h4">
            {mangaInfo.title_english}
          </Typography>
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ flexGrow: 1 }}
              onClick={() => history.push(`/manga/${id}/chapter/${prevChapter}`)}
            >
              Prev
            </Button>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Chapter {chapterNumber} {title && ` - ${title}`}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ flexGrow: 1 }}
              onClick={() => history.push(`/manga/${id}/chapter/${nextChapter}`)}
            >
              Next
            </Button>
          </div>
        </div>
        <List>
          {pagesToDisplay}
        </List>
        <ChapterList chapters={chapters} selectedChapter={chapterNumber} />
        <br />
      </Grid>
      <Grid item xs="auto" sm={1} md={4} />
    </Grid>

  );
};

export default ReadChapterPage;