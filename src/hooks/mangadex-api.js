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

export const useMangaData = (id) => {
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
