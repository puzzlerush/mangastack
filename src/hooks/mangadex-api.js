import { useState, useEffect } from 'react';
import qs from 'qs';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';
import { mangaToV2, chaptersToV2 } from './toV2';

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

export const useMangaData = (id, language = 'en') => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});

  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await axios.get(`/api/manga/${id}`, {
        params: {
          includes: ['author', 'artist', 'cover_art'],
        },
        paramsSerializer: (params) => {
          return qs.stringify(params);
        },
      });
      const mangaObj = await mangaToV2(response.data, language);
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
  }, [id, language]);

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
            includes: ['scanlation_group'],
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
      allChapters = allChapters.concat(response.data.data);

      for (
        let i = 0;
        i < Math.ceil((response.data.total - limit) / limit);
        i += 1
      ) {
        offset += limit;
        const nextFeedResponse = await getFeed(limit, offset);
        allChapters = allChapters.concat(nextFeedResponse.data.data);
      }

      const chaptersWithGroupNames = chaptersToV2(allChapters, id);

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

export const useMangaList = (
  order,
  language = 'en',
  { limit = 8, offset = 0, contentRating, title } = {}
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaList, setMangaList] = useState([]);
  const [total, setTotal] = useState(0);

  const [[orderField, orderDir]] = Object.entries(order);
  const contentRatingKey = contentRating ? contentRating.join(',') : '';

  useEffect(() => {
    const currentOrder = { [orderField]: orderDir };
    const currentContentRating = contentRatingKey ? contentRatingKey.split(',') : undefined;

    const fetchList = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/manga', {
          params: {
            limit,
            offset,
            includes: ['author', 'artist', 'cover_art'],
            order: currentOrder,
            ...(title ? { title } : { hasAvailableChapters: true }),
            ...(currentContentRating && { contentRating: currentContentRating }),
          },
          paramsSerializer: (params) => qs.stringify(params),
        });
        setTotal(response.data.total);
        const transformed = await Promise.all(
          response.data.data.map((item) => mangaToV2({ data: item }, language))
        );
        const ids = transformed.map((m) => m.id);
        const statsResponse = await axios.get('/api/statistics/manga', {
          params: { manga: ids },
          paramsSerializer: (params) => qs.stringify(params),
        });
        const stats = statsResponse.data.statistics;
        const withRatings = transformed.map((m) => ({
          ...m,
          rating: { bayesian: stats[m.id]?.rating?.bayesian ?? 0 },
        }));
        setMangaList(withRatings);
      } catch (e) {
        setError('Could not fetch manga from MangaDex API');
      }
      setIsLoading(false);
    };
    fetchList();
  }, [orderField, orderDir, language, limit, offset, contentRatingKey, title]);

  return { isLoading, error, mangaList, total };
};

export const useMangaStatistics = (id) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/statistics/manga/${id}`);
        const bayesian = response.data.statistics[id]?.rating?.bayesian ?? 0;
        setRating(bayesian);
      } catch (e) {
        // silently ignore — rating stays 0
      }
    };
    fetchStats();
  }, [id]);

  return { rating };
};
