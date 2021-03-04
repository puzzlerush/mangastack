import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const getEnglishChaptersWithGroups = (chapters, groups) => {
  const englishChapters = chapters.filter((chapter) => chapter.language === "gb");
  const groupDictionary = {};
  groups.forEach((group) => groupDictionary[group.id] = group.name);
  const modifiedEnglishChapters = englishChapters.map((chapter) => {
    const groupNames = {};
    chapter.groups.forEach((groupID) => groupNames[groupID] = htmlDecode(groupDictionary[groupID]));
    return { ...chapter, groups: groupNames };
  });
  return modifiedEnglishChapters;
}

export const useMangaData = (id) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchMangaData = async () => {
      const response = await axios.get(`/manga/${id}`);
      setMangaInfo(response.data.data);
    };

    const fetchChaptersData = async () => {
      const response = await axios.get(`/manga/${id}/chapters`);
      const { chapters, groups } = response.data.data;
      setChapters(getEnglishChaptersWithGroups(chapters, groups));
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
  }, []);

  return { isLoading, error, mangaInfo, chapters };
}