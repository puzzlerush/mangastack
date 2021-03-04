import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Grid, Typography, List, ListItem, Button } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import ChapterList from './ChapterList';
import PageNavigation from './PageNavigation';
import Loader from './Loader';
import axios from '../config/axios';
import { getEnglishChaptersWithGroups } from '../hooks/mangadex-api';

const ReadChapterPage = () => {
  const { mangaId, chapterId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [chapterInfo, setChapterInfo] = useState({});
  const [chapterPages, setChapterPages] = useState([]);

  useEffect(() => {
    const fetchChapterInfo = async () => {
      const response = await axios.get(`/manga/${mangaId}/chapters`);
      const { chapters, groups } = response.data.data;
      setAllChapters(getEnglishChaptersWithGroups(chapters, groups));
      const currentChapter = chapters.find((chapter) => chapter.id === parseInt(chapterId));
      setChapterInfo(currentChapter);
      return currentChapter.hash;
    };

    const fetchPages = async (hash) => {
      const response = await axios.get(`/chapter/${hash}`);
      const { pages, server } = response.data.data;
      const pageURLs = pages.map((page) => `${server}${hash}/${page}`);
      setChapterPages(pageURLs);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const chapterHash = await fetchChapterInfo();
        await fetchPages(chapterHash);
      } catch (e) {
        setError(`An error occured while fetching the chapter data.\nPlease make sure the IDs in the URL point to valid resources.`);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [chapterId]);

  const pagesToDisplay = chapterPages.map((chapterPage, index) => (
    <ListItem key={chapterPage}>
      <img style={{ width: '100%' }} src={chapterPage} alt={`Error loading page ${index + 1}`} />
    </ListItem>
  ));

  let history = useHistory();

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
    const { id: chapterId, mangaTitle, chapter: chapterNumber, title, groups } = chapterInfo;
    let prevChapter, nextChapter, scanlatorNames;
    if (allChapters) {
      const chaptersBySameScanlator = allChapters.filter((chapter) => {
        for (const group of groups) {
          return chapter.groups[group] !== undefined;
        }
      });
      const index = chaptersBySameScanlator.findIndex((chapter) => chapter.id === chapterId);
      prevChapter = chaptersBySameScanlator[index + 1];
      nextChapter = chaptersBySameScanlator[index - 1];

      const currentChapterFoundInList = allChapters.find((chapter) => chapter.id === chapterId);
      scanlatorNames = Object.values(currentChapterFoundInList.groups).join(', ');
    }

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs="auto" sm={1} md={4} />
        <Grid item xs={12} sm={10} md={8}>
          <PageNavigation 
            history={history} 
            prevLink={`/manga/${mangaId}/chapter/${prevChapter && prevChapter.id}`}
            nextLink={`/manga/${mangaId}/chapter/${nextChapter && nextChapter.id}`}
            disablePrev={!prevChapter}
            disableNext={!nextChapter} 
          />
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h4">
              {mangaTitle}
            </Typography>
            <br />
            <Typography variant="h6">
              Chapter {chapterNumber} {title && ` - ${title}`}
            </Typography>
            {scanlatorNames && (
              <Typography variant="subtitle1">
                Scanlated by {scanlatorNames}
              </Typography>
            )}
          </div>
          <List>
            {pagesToDisplay}
          </List>
          <ChapterList chapters={allChapters} selectedChapter={chapterId} />
          <br />
          <PageNavigation 
            history={history}
            topOfPage={false}
            prevLink={`/manga/${mangaId}/chapter/${prevChapter && prevChapter.id}`}
            nextLink={`/manga/${mangaId}/chapter/${nextChapter && nextChapter.id}`}
            disablePrev={!prevChapter}
            disableNext={!nextChapter} 
          />
        </Grid>
        <Grid item xs="auto" sm={1} md={4} />
      </Grid>

    );
  }
};

export default ReadChapterPage;