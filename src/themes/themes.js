import { createMuiTheme } from '@material-ui/core/styles';

const lightTheme = createMuiTheme({});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#ffa500'
    }
  }
});

export default (themeName) => {
  switch (themeName) {
    case 'light':
      return lightTheme;
    case 'dark':
      return darkTheme;
    default:
      return lightTheme;
  }
};