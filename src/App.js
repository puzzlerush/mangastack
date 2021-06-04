import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Paper, Typography, Box, Link } from '@material-ui/core';
import AppRouter from './routers/AppRouter';
import getTheme from './themes/themes';

function App({ theme }) {
  return (
    <div className="App">
      <ThemeProvider theme={getTheme(theme)}>
        <Paper elevation={0} style={{ minHeight: '100vh' }}>
          {/* <AppRouter /> */}
          <Box paddingY={7} paddingX={2}>
            <Typography paragraph variant="h3" align="center">
              We'll be back!
            </Typography>
            <Typography paragraph variant="subtitle1" align="center">
              Unfortunately, it has been brought to my attention that this site
              has been causing DMCA issues for{' '}
              <Link href="https://api.mangadex.org/docs.html#section/Reading-a-chapter-using-the-API/Retrieving-pages-from-the-MangaDex@Home-network">
                MangaDex@Home
              </Link>{' '}
              clients.
            </Typography>
            <Typography paragraph variant="subtitle1" align="center">
              Therefore, I have decided to temporarily shut down{' '}
              <Link href="http://mangastack.cf/">mangastack.cf</Link>, until I
              can figure out a workaround.
            </Typography>
            <Typography paragraph variant="subtitle1" align="center">
              If you have any questions, feel free to contact me on{' '}
              <Link href="https://www.reddit.com/user/dalkerkd/">reddit</Link>.
            </Typography>
            <Typography paragraph variant="h4" align="center">
              Thanks for your understanding!
            </Typography>
          </Box>
        </Paper>
      </ThemeProvider>
    </div>
  );
}

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
});

export default connect(mapStateToProps)(App);
