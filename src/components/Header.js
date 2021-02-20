import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import themes from '../themes/themes';
import { setTheme } from '../actions/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4)
  },
  title: {
    flexGrow: 1
  }
}))

const Header = ({ theme, setTheme }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6">Manga Reader</Typography>
          <Switch
            checked={Object.is(theme, themes.darkTheme)}
            onChange={() => Object.is(theme, themes.lightTheme) ? setTheme(themes.darkTheme) : setTheme(themes.lightTheme)}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(setTheme(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);