import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Paper, Typography, Switch } from '@material-ui/core';
import themes from './themes/themes';
import { setTheme } from './actions/theme';

function App({ theme, setTheme }) {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Paper style={{ minHeight: '100vh' }}>
          <Typography variant="h1">This is my App!</Typography>
          <Switch
            checked={Object.is(theme, themes.darkTheme)}
            onChange={() => Object.is(theme, themes.lightTheme) ? setTheme(themes.darkTheme) : setTheme(themes.lightTheme)}
          />
        </Paper>
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => ({
  theme: state.theme
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(setTheme(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
