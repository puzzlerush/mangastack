import { useState, useEffect } from 'react';
import qs from 'qs';
import { usePrevious } from './common';
import axios from '../config/axios';

export const shallowIsEqual = (a, b) => {
  for (const key in { ...a, ...b }) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
};

export const useResults = (endpoint, params) => {
  const prevParams = usePrevious(params) || {};
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(endpoint, { params });
        const mangaIds = response.data.results.map(({ id }) => id);

        const coverMap = {};
        try {
          const mangadexResponse = await axios.get('/api/manga', {
            params: {
              ids: mangaIds,
              includes: ['cover_art'],
              limit: 12,
            },
            paramsSerializer: (params) => {
              return qs.stringify(params);
            },
          });
          const mangaCovers = mangadexResponse.data.results.map(
            ({ data: { id }, relationships }) => ({
              ...relationships.find(({ type }) => type === 'cover_art'),
              mangaId: id,
            })
          );

          mangaCovers.forEach(({ mangaId, attributes: { fileName } }) => {
            coverMap[
              mangaId
            ] = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.512.jpg`;
          });
        } catch (e) {}

        setResults(
          response.data.results.map((result) => ({
            ...result,
            mainCover: coverMap[result.id] || '',
          }))
        );
        setCount(response.data.count);
      } catch (e) {}
      return setIsLoading(false);
    };

    if (!shallowIsEqual(prevParams, params)) {
      fetchResults();
    }
  }, [params]);

  return [isLoading, results, count];
};
