import qs from 'qs';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const mangaToV2 = async ({
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

export const chaptersToV2 = (chapters, mangaId) => {
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
