import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import {
  Grid,
  Typography,
  List,
  ListItem,
  LinearProgress,
  Box,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Helmet } from 'react-helmet';
import ChapterList from './ChapterList';
import PageNavigation from './PageNavigation';
import Loader from './Loader';
import axios from '../config/axios';
import {
  getLanguageChaptersWithGroups,
  useMangaData,
  useChapters,
} from '../hooks/mangadex-api';
import { setReading } from '../actions/mangaList';
import { htmlDecode, generateMetaKeywordsTitle } from '../utils/utils';
import languageOptions from '../assets/languageOptions';

const ReadChapterPage = ({ language, setReading }) => {
  const { mangaId, chapterId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapterInfo, setChapterInfo] = useState({});
  const [chapterPages, setChapterPages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const {
    isLoading: mangaLoading,
    error: mangaError,
    mangaInfo,
  } = useMangaData(mangaId);
  const {
    isLoading: chaptersLoading,
    error: chaptersError,
    chapters: allChapters,
  } = useChapters(mangaId, language, 500, 0);

  // If the user changes the language while reading a chapter,
  // redirect them to the Manga page
  let history = useHistory();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    history.push(`/manga/${mangaId}`);
  }, [language]);

  useEffect(() => {
    const fetchChapterInfo = () => {
      const currentChapter = allChapters.find(
        (chapter) => chapter.id === chapterId
      );
      if (!currentChapter) {
        throw new Error();
      }

      const currentChapterWithManga = {
        ...currentChapter,
        mangaTitle: mangaInfo.title,
      };

      setChapterInfo(currentChapterWithManga);
      setReading({ id: mangaId }, currentChapterWithManga);
      return currentChapter;
    };

    const fetchPages = async (currentChapter) => {
      const response = await axios.get(`/api/at-home/server/${chapterId}`);
      const { baseUrl } = response.data;
      const { dataSaver: pages } = currentChapter;
      const pageURLs = pages.map(
        (page) => `${baseUrl}/data-saver/${currentChapter.hash}/${page}`
      );

      const imageBuffers = await Promise.all(
        pageURLs.map((url) =>
          axios
            .get(`/mdh/${url}`, {
              responseType: 'arraybuffer',
            })
            .then((response) =>
              Buffer.from(response.data, 'binary').toString('base64')
            )
        )
      );

      setChapterPages(imageBuffers);
      setImagesLoaded(0);
      setTimeout(() => {
        setImagesLoaded(pageURLs.length);
      }, 10000);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentChapter = fetchChapterInfo();
        await fetchPages(currentChapter);
      } catch (e) {
        setError(
          `An error occured while fetching the chapter data.\nPlease make sure the IDs in the URL point to valid resources.`
        );
      }
      setIsLoading(false);
    };
    if (!mangaLoading && !chaptersLoading) {
      fetchData();
    }
  }, [chapterId, mangaLoading, chaptersLoading]);

  const imagesLoading = !(
    chapterPages.length > 0 && imagesLoaded >= chapterPages.length
  );

  const pagesToDisplay = chapterPages.map((chapterPage, index) => (
    <ListItem key={chapterPage}>
      <img
        style={{
          width: '100%',
          display: imagesLoading ? 'none' : 'block',
        }}
        src={`data:image/jpg;base64, ${chapterPage}`}
        alt={`Error loading page ${index + 1}`}
        onLoad={() => setImagesLoaded(imagesLoaded + 1)}
      />
    </ListItem>
  ));

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  } else {
    const {
      id: chapterId,
      mangaTitle,
      chapter: chapterNumber,
      title,
      groups: groupsMapping,
    } = chapterInfo;
    const groups = Object.keys(groupsMapping);
    let prevChapter, nextChapter, scanlatorNames;
    if (allChapters) {
      const index = allChapters.findIndex(
        (chapter) => chapter.id === chapterId
      );

      // Find the previous/next chapter's number
      let prevChapterNumber;
      for (let i = index; i < allChapters.length; i += 1) {
        if (chapterNumber !== allChapters[i].chapter) {
          prevChapterNumber = allChapters[i].chapter;
          break;
        }
      }

      let nextChapterNumber;
      for (let i = index; i >= 0; i -= 1) {
        if (chapterNumber !== allChapters[i].chapter) {
          nextChapterNumber = allChapters[i].chapter;
          break;
        }
      }

      // Get all chapters with the same number as the previous/next chapter
      const beforeChapters = allChapters.filter(
        (chapter) => chapter.chapter === prevChapterNumber
      );
      const beforeBySameScanlator = beforeChapters.find((chapter) => {
        for (const group of groups) {
          return chapter.groups[group] !== undefined;
        }
      });

      const afterChapters = allChapters.filter(
        (chapter) => chapter.chapter === nextChapterNumber
      );
      const afterBySameScanlator = afterChapters.find((chapter) => {
        for (const group of groups) {
          return chapter.groups[group] !== undefined;
        }
      });

      // If the previous/next chapter has a scan by the same scanlator, link to that one
      prevChapter =
        beforeBySameScanlator || beforeChapters[beforeChapters.length - 1];
      nextChapter =
        afterBySameScanlator || afterChapters[afterChapters.length - 1];

      const currentChapterFoundInList = allChapters.find(
        (chapter) => chapter.id === chapterId
      );
      scanlatorNames = Object.values(currentChapterFoundInList.groups).join(
        ', '
      );
    }

    const chapterBaseURL = `/manga/${mangaId}/chapter/`;
    return (
      <>
        <Helmet>
          <title>
            {`${mangaTitle} - Chapter ${chapterNumber}${
              title ? `: ${title}` : ''
            } - MangaStack`}
          </title>
          <meta
            name="description"
            content={htmlDecode(mangaInfo.description).replace(/\[.*?\]/g, '')}
          />
          <meta
            name="keywords"
            content={generateMetaKeywordsTitle(mangaTitle)}
          />
        </Helmet>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs="auto" md={4} />
          <Grid item xs={12} md={8}>
            <PageNavigation
              prevLink={`${chapterBaseURL}${prevChapter && prevChapter.id}`}
              nextLink={`${chapterBaseURL}${nextChapter && nextChapter.id}`}
              disablePrev={!prevChapter}
              disableNext={!nextChapter}
            />
            <div style={{ textAlign: 'center' }}>
              <Link
                to={`/manga/${mangaId}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Typography variant="h4">{mangaTitle}</Typography>
              </Link>
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
            {imagesLoading && (
              <Box m={4}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Loading images...
                </Typography>
                <Box display="flex" alignItems="center">
                  <Box width="100%" m={2}>
                    <LinearProgress
                      variant="determinate"
                      value={(imagesLoaded / chapterPages.length) * 100}
                    />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">
                      {imagesLoaded + '/' + chapterPages.length}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            <List>{pagesToDisplay}</List>
            <ChapterList chapters={allChapters} selectedChapter={chapterId} />
            <br />
            <PageNavigation
              topOfPage={false}
              prevLink={`${chapterBaseURL}${prevChapter && prevChapter.id}`}
              nextLink={`${chapterBaseURL}${nextChapter && nextChapter.id}`}
              disablePrev={!prevChapter}
              disableNext={!nextChapter}
            />
          </Grid>
          <Grid item xs="auto" md={4} />
        </Grid>
      </>
    );
  }
};

ReadChapterPage.propTypes = {
  language: PropTypes.oneOf(languageOptions.map((language) => language.value)),
};

ReadChapterPage.defaultProps = {
  language: 'en',
};

const mapStateToProps = (state) => ({
  language: state.settings.language,
});

const mapDispatchToProps = (dispatch) => ({
  setReading: (mangaInfo, chapterInfo) =>
    dispatch(setReading(mangaInfo, chapterInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReadChapterPage);
