const mangaListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_READING':
      const { mangaInfo, chapterInfo } = action;
      const filteredState = state.filter(
        (progressObj) => progressObj.mangaInfo.id !== mangaInfo.id
      );
      return [...filteredState, { mangaInfo, chapterInfo }];
    case 'DELETE_ITEM':
      return state.filter(({ mangaInfo, chapterInfo }) => mangaInfo.id !== action.mangaId);
    default:
      return state;
  }
};

export default mangaListReducer;