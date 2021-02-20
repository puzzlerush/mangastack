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

const themes = {
  lightTheme,
  darkTheme
};

export default themes;