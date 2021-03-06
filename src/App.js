import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import AppRouter from './routers/AppRouter';
import getTheme from './themes/themes';

function App({ theme }) {
  return (
    <div className="App">
      <ThemeProvider theme={getTheme(theme)}>
        <Paper elevation={0} style={{ minHeight: '100vh' }}>
          <AppRouter />
        </Paper>
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => ({
  theme: state.settings.theme
});

export default connect(mapStateToProps)(App);
