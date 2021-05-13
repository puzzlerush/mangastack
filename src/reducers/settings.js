const defaultSettingsState = {
  theme: 'light',
  language: 'en',
  nsfw: false,
};

const settingsReducer = (state = defaultSettingsState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_LANGUAGE':
      return { ...state, language: action.language };
    case 'SET_NSFW':
      return { ...state, nsfw: action.nsfw };
    default:
      return state;
  }
};

export default settingsReducer;
