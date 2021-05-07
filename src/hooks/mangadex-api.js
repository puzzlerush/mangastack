import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const getLanguageChapters = (chapters, language = 'en') => {
  const languageChapters = chapters.filter(
    (chapter) => chapter.language === language
  );
  return languageChapters;
};

const getRelation = (relationships, type) => {
  const endpointEnums = {
    author: 'author',
    artist: 'author',
    scanlation_group: 'group',
  };
  return Promise.all(
    relationships
      .filter((relationship) => relationship.type === type)
      .map(({ id }) => axios.get(`/api/${endpointEnums[type]}/${id}`))
  );
};

const mangaToV2 = async ({ data: manga, relationships }) => {
  const {
    id,
    attributes: {
      title: { en: title },
      description: { en: description },
    },
  } = manga;

  const author = (await getRelation(relationships, 'author')).map(
    ({
      data: {
        data: {
          attributes: { name },
        },
      },
    }) => name
  );

  const artist = (await getRelation(relationships, 'artist')).map(
    ({
      data: {
        data: {
          attributes: { name },
        },
      },
    }) => name
  );

  return {
    id,
    title,
    description,
    author,
    artist,
    mainCover:
      'https://static.wikia.nocookie.net/chainsaw-man/images/8/8b/Volume_10.jpg',
    rating: { bayesian: 0 },
    views: 0,
  };
};

const chaptersToV2 = ({ results: chapters }) => {
  return Promise.all(
    chapters.map(
      async ({
        data: {
          id,
          attributes: {
            chapter,
            title,
            translatedLanguage: language,
            hash,
            data: pages,
            dataSaver: pagesLQ,
            publishAt,
          },
        },
        relationships,
      }) => {
        const groups = (
          await getRelation(relationships, 'scanlation_group')
        ).map(({ data: { data: { id, attributes: { name } } } }) => ({
          id,
          name,
        }));

        const groupObj = {};
        groups.forEach(({ id, name }) => {
          groupObj[id] = name;
        });
        return {
          id,
          chapter,
          title,
          language,
          hash,
          pages,
          pagesLQ,
          groups: groupObj,
          publishAt,
        };
      }
    )
  );
};

export const useMangaData = (id, language) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await axios.get(`/api/manga/${id}`);
      const mangaObj = await mangaToV2(response.data);
      mangaObj.title = htmlDecode(mangaObj.title);
      mangaObj.description = htmlDecode(mangaObj.description);
      setMangaInfo(mangaObj);
    };

    const fetchChaptersData = async () => {
      const response = await axios.get(`/api/chapter?manga=${id}&limit=100`);
      console.log(response.data.results);
      setChapters(getLanguageChapters(await chaptersToV2(response.data)));
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMangaData();
        await fetchChaptersData();
      } catch (e) {
        console.log(e);
        setError('Could not fetch data from MangaDex API');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id, language]);

  return { isLoading, error, mangaInfo, chapters };
};
