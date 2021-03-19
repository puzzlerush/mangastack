import { useState, useEffect } from 'react';
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
        setResults(response.data.results);
        setCount(response.data.count);
      } catch (e) { }
      return setIsLoading(false);
    };

    if (!shallowIsEqual(prevParams, params)) {
      fetchResults();
    }
  }, [params]);

  return [isLoading, results, count];
}; 