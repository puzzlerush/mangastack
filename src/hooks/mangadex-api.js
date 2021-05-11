import { useState, useEffect } from 'react';
import qs from 'qs';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const getLanguageChaptersWithGroups = (
  chapters,
  groups,
  language = 'gb'
) => {
  const languageChapters = chapters.filter(
    (chapter) => chapter.language === language
  );
  const groupDictionary = {};
  groups.forEach((group) => (groupDictionary[group.id] = group.name));
  const modifiedLanguageChapters = languageChapters.map((chapter) => {
    const groupNames = {};
    chapter.groups.forEach(
      (groupID) => (groupNames[groupID] = htmlDecode(groupDictionary[groupID]))
    );
    return { ...chapter, groups: groupNames };
  });
  return modifiedLanguageChapters;
};

const mangaToV2 = async ({
  data: {
    id,
    attributes: {
      title: { en: title },
      description: { en: description },
    },
  },
  relationships,
}) => {
  const authorIds = relationships
    .filter(({ type }) => type === 'author')
    .map(({ id }) => id);
  const artistIds = relationships
    .filter(({ type }) => type === 'artist')
    .map(({ id }) => id);

  const response = await axios.get('/api/author', {
    params: {
      ids: Array.from(new Set(authorIds.concat(artistIds))),
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });

  const authorsMapping = {};
  response.data.results.forEach(
    ({
      data: {
        id,
        attributes: { name },
      },
    }) => {
      authorsMapping[id] = name;
    }
  );

  const author = authorIds.map((id) => authorsMapping[id]);
  const artist = artistIds.map((id) => authorsMapping[id]);

  return {
    id,
    title: htmlDecode(title),
    description: htmlDecode(description),
    mainCover:
      'https://static.wikia.nocookie.net/chainsaw-man/images/8/8b/Volume_10.jpg',
    rating: { bayesian: 0 },
    views: 0,
    author,
    artist,
  };
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
      setMangaInfo(mangaObj);
    };

    // const fetchChaptersData = async () => {
    //   const response = await axios.get(`/api/manga/${id}/chapters`);
    //   const { chapters, groups } = response.data.data;
    //   setChapters(getLanguageChaptersWithGroups(chapters, groups, language));
    // };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMangaData();
        // await fetchChaptersData();
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
