import themes from '../themes/themes';

const defaultSettingsState = {
  theme: themes.lightTheme,
  showNSFW: false
}; 

const themeReducer = (state = defaultSettingsState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    default:
      return defaultSettingsState;
  }
};

export default themeReducer;