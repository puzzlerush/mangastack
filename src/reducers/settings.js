const defaultSettingsState = {
  theme: 'light',
  language: 'en',
  nsfw: false,
  useLowResolution: false,
};

const settingsReducer = (state = defaultSettingsState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'SET_LANGUAGE':
      return { ...state, language: action.language };
    case 'SET_NSFW':
      return { ...state, nsfw: action.nsfw };
    case 'SET_USE_LOW_RESOLUTION':
      return { ...state, useLowResolution: action.useLowResolution };
    default:
      return state;
  }
};

export default settingsReducer;
