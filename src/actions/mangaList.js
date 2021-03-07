export const setReading = (mangaInfo, chapterInfo) => ({
  type: 'SET_READING',
  mangaInfo,
  chapterInfo
});

export const deleteItem = (mangaId) => ({
  type: 'DELETE_ITEM',
  mangaId
});