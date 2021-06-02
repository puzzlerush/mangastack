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
      links: { mal },
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

  let coverRequest = new Promise((resolve, reject) => {
    resolve({
      data: {
        image_url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png',
      },
    });
  });
  if (mal) {
    coverRequest = axios.get(`https://api.jikan.moe/v3/manga/${mal}`);
  }

  const authorsRequest = axios.get('/api/author', {
    params: {
      ids: Array.from(new Set(authorIds.concat(artistIds))),
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });

  const [coverResponse, authorsResponse] = await Promise.all([
    coverRequest,
    authorsRequest,
  ]);

  const authorsMapping = {};
  authorsResponse.data.results.forEach(
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
    mainCover: coverResponse.data.image_url,
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
        hash,
        data,
        dataSaver,
        id,
        mangaId,
        chapter,
        title: htmlDecode(title),
        timestamp,
        groups,
      };
    }
  );
};

export const useMangaData = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});

  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await axios.get(`/api/manga/${id}`);
      const mangaObj = await mangaToV2(response.data);
      setMangaInfo(mangaObj);
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMangaData();
      } catch (e) {
        setError('Could not fetch manga info from MangaDex API');
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  return { isLoading, error, mangaInfo };
};

export const useChapters = (id, language, limit, offset) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChaptersData = async () => {
      const getFeed = (limit, offset) => {
        return axios.get(`/api/manga/${id}/feed`, {
          params: {
            order: {
              chapter: 'desc',
            },
            limit,
            offset,
            translatedLanguage: [language],
          },
          paramsSerializer: (params) => {
            return qs.stringify(params);
          },
        });
      };

      const limit = 500;
      let offset = 0;
      const response = await getFeed(limit, offset);
      let allChapters = [];
      allChapters = allChapters.concat(response.data.results);

      for (
        let i = 0;
        i < Math.ceil((response.data.total - limit) / limit);
        i += 1
      ) {
        offset += limit;
        const nextFeedResponse = await getFeed(limit, offset);
        allChapters = allChapters.concat(nextFeedResponse.data.results);
      }

      const chaptersWithoutGroupNames = chaptersToV2(allChapters, id);

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
          groupsMapping[id] = htmlDecode(name);
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

      setChapters(chaptersWithGroupNames);
    };
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchChaptersData();
      } catch (e) {
        setError('Could not fetch chapters data from MangaDex API');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id, language, limit, offset]);

  return { isLoading, error, chapters };
};
