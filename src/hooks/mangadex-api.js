import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const getLanguageChaptersWithGroups = (chapters, groups, language) => {
  const languageChapters = chapters.filter((chapter) => chapter.language === language);
  const groupDictionary = {};
  groups.forEach((group) => groupDictionary[group.id] = group.name);
  const modifiedLanguageChapters = languageChapters.map((chapter) => {
    const groupNames = {};
    chapter.groups.forEach((groupID) => groupNames[groupID] = htmlDecode(groupDictionary[groupID]));
    return { ...chapter, groups: groupNames };
  });
  return modifiedLanguageChapters;
}

export const useMangaData = (id, language) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await axios.get(`/api/manga/${id}`);
      const mangaObj = { ...response.data.data };
      mangaObj.title = htmlDecode(mangaObj.title);
      mangaObj.description = htmlDecode(mangaObj.description);
      setMangaInfo(mangaObj);
    };

    const fetchChaptersData = async () => {
      const response = await axios.get(`/api/manga/${id}/chapters`);
      const { chapters, groups } = response.data.data;
      setChapters(getLanguageChaptersWithGroups(chapters, groups, language));
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchMangaData();
        await fetchChaptersData();
      } catch (e) {
        setError('Could not fetch data from MangaDex API');
      }
      setIsLoading(false);
    }

    fetchData();
  }, [id, language]);

  return { isLoading, error, mangaInfo, chapters };
}