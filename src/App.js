import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import AppRouter from './routers/AppRouter';

function App({ theme }) {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Paper elevation={0} style={{ minHeight: '100vh' }}>
          <AppRouter />
        </Paper>
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => ({
  theme: state.theme
});

export default connect(mapStateToProps)(App);
