import themes from '../themes/themes';

const themeReducer = (state = themes.lightTheme, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return action.theme;
    default:
      return state;
  }
};

export default themeReducer;