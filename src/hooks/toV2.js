import { htmlDecode } from '../utils/utils';

export const mangaToV2 = async (
  {
    data: {
      id,
      attributes: { title: titleObj, description: descObj },
      relationships,
    },
  },
  language = 'en'
) => {
  const title = titleObj[language] ?? titleObj['en'] ?? Object.values(titleObj)[0] ?? '';
  const description = descObj[language] ?? descObj['en'] ?? Object.values(descObj)[0] ?? '';
  const author = relationships
    .filter(({ type }) => type === 'author')
    .map(({ attributes: { name } }) => name);
  const artist = relationships
    .filter(({ type }) => type === 'artist')
    .map(({ attributes: { name } }) => name);
  const coverArtRel = relationships.find(({ type }) => type === 'cover_art');
  const fileName = coverArtRel?.attributes?.fileName;
  const mainCover = fileName ? `/image/covers/${id}/${fileName}` : '';

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
      id,
      attributes: {
        chapter,
        title,
        translatedLanguage: language,
        hash,
        data,
        dataSaver,
        externalUrl,
        createdAt,
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
        externalUrl,
        id,
        mangaId,
        chapter,
        title: title ? htmlDecode(title) : '',
        timestamp,
        groups: groupsMap,
      };
    }
  );
};
