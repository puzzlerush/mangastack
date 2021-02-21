import { useState, useEffect } from 'react';
import axios from '../config/axios';

export const useMangaData = (id) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mangaInfo, setMangaInfo] = useState({});
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchMangaData = async () => {
      // Get the title of the manga from its id using the MangaDex API
      const response = await axios.get(`/manga/${id}`);
      const title = response.data.data.title;

      // Use Jikan API to get detailed information about the manga
      const jikanSearchResponse = await axios.get(`https://api.jikan.moe/v3/search/manga?q=${title}&page=1`);
      const results = jikanSearchResponse.data.results;
      const matchingEntry = results[0];
      const jikanMangaResponse = await axios.get(`https://api.jikan.moe/v3/manga/${matchingEntry.mal_id}`)
      setMangaInfo(jikanMangaResponse.data);
    };

    const fetchChaptersData = async () => {
      const response = await axios.get(`/manga/${id}/chapters`);
      const chapters = response.data.data.chapters;
      const englishChapters = chapters.filter((chapter) => chapter.language === "gb");
      setChapters(englishChapters);
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