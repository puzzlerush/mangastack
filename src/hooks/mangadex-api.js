import { useState, useEffect } from 'react';
import qs from 'qs';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const getLanguageChaptersWithGroups = (
  chapters,
  groups,
  language = 'en'
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

const chaptersToV2 = (chapters, mangaId) => {
  return chapters.map(
    ({
      data: {
        id,
        attributes: {
          chapter,
          title,
          translatedLanguage: language,
          hash,
          data,
          dataSaver,
          createdAt,
        },
      },
      relationships,
    }) => {
      const timestamp = new Date(createdAt).getTime() / 1000;
      const groups = relationships
        .filter(({ type }) => type === 'scanlation_group')
        .map(({ id }) => id);
      return {
        groups: {
          1: 'Underlord',
          2: 'Tomato',
        },
        hash,
        id,
        mangaId,
        chapter,
        title,
        timestamp,
        groups,
      };
    }
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
      setMangaInfo(mangaObj);
    };

    const fetchChaptersData = async () => {
      const response = await axios.get(`/api/manga/${id}/feed`, {
        params: {
          order: {
            chapter: 'desc',
          },
          limit: 500,
          locales: [language],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      });
      const { results: chapters } = response.data;

      const chaptersWithoutGroupNames = chaptersToV2(chapters, id);

      const groupList = Array.from(
        new Set(
          chaptersWithoutGroupNames.reduce(
            (acc, { groups }) => acc.concat(groups),
            []
          )
        )
      );

      const groupsMapping = {};

      const {
        data: { results },
      } = await axios.get('/api/group', {
        params: {
          ids: groupList,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      });

      results.forEach(
        ({
          data: {
            id,
            attributes: { name },
          },
        }) => {
          groupsMapping[id] = name;
        }
      );

      const chaptersWithGroupNames = chaptersWithoutGroupNames.map(
        (chapter) => {
          const groups = {};
          chapter.groups.forEach((id) => {
            groups[id] = groupsMapping[id];
          });
          return {
            ...chapter,
            groups,
          };
        }
      );

      console.log(chaptersWithGroupNames);

      setChapters(chaptersWithGroupNames);
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
