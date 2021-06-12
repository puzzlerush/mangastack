import qs from 'qs';
import axios from '../config/axios';
import { htmlDecode } from '../utils/utils';

export const mangaToV2 = async ({
  data: {
    id,
    attributes: {
      title: { en: title },
      description: { en: description },
    },
  },
  relationships,
}) => {
  const author = relationships
    .filter(({ type }) => type === 'author')
    .map(({ name }) => name);
  const artist = relationships
    .filter(({ type }) => type === 'artist')
    .map(({ name }) => name);
  const {
    attributes: { fileName },
  } = relationships.find(({ type }) => type === 'cover_art');
  const mainCover = `https://uploads.mangadex.org/covers/${id}/${fileName}`;
  return {
    id,
    title: htmlDecode(title),
    description: htmlDecode(description),
    mainCover,
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
      const groupsList = relationships
        .filter(({ type }) => type === 'scanlation_group')
        .map(({ id, attributes: { name } }) => ({ id, name }));
      const groupsMap = {};
      groupsList.forEach(({ id, name }) => {
        groupsMap[id] = name;
      });
      return {
        hash,
        data,
        dataSaver,
        id,
        mangaId,
        chapter,
        title: htmlDecode(title),
        timestamp,
        groups: groupsMap,
      };
    }
  );
};
