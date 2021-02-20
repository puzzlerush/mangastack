import { createMuiTheme } from '@material-ui/core/styles';

const lightTheme = createMuiTheme({});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const themes = {
  lightTheme,
  darkTheme
};

export default themes;