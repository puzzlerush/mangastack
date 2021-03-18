import PropTypes from 'prop-types';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography,
  Switch, InputBase, Box, Tooltip,
  IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, FormControlLabel,
  Divider, Checkbox, Select, Dialog,
  DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Book as BookIcon,
  ViewModule as ViewModuleIcon
} from '@material-ui/icons';
import { fade, makeStyles } from '@material-ui/core/styles';
import { setTheme, setNSFW, setLanguage } from '../actions/settings';
import { deleteAll } from '../actions/mangaList';
import languageOptions from '../assets/languageOptions';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4)
  },
  toolBar: {
    [theme.breakpoints.only('xs')]: {
      paddingLeft: 11,
      paddingRight: 11
    },
    paddingTop: 10,
    paddingBottom: 10
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  sidebarList: {
    width: 250
  },
  title: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      flexGrow: 1
    }
  },
  searchIcon: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
    },
    width: '50vw'
  },
}))

const Header = ({
  theme, setTheme,
  nsfw, setNSFW,
  language, setLanguage,
  deleteAllMangaListEntries
}) => {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageSelectInput, setLanguageSelectInput] = useState(language);
  const [dialogOpen, setDialogOpen] = useState(false);
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search?q=${encodeURIComponent(searchInput)}`)
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
    setLanguageSelectInput(language);
  };

  const handleDialogConfirm = () => {
    setDialogOpen(false);
    deleteAllMangaListEntries();
    setLanguage(languageSelectInput);
  };

  const sidebarItems = [
    {
      label: 'Home',
      path: '/',
      Icon: HomeIcon
    },
    {
      label: 'All Manga',
      path: '/manga/all',
      Icon: ViewModuleIcon
    },
    {
      label: 'Currently Reading',
      path: '/currently-reading',
      Icon: BookIcon
    },
  ];

  const sidebarItemsToDisplay = sidebarItems.map(({ label, path, Icon }) => (
    <ListItem key={path} button component={Link} to={path}>
      <ListItemIcon><Icon /></ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  ));

  const languageOptionsToDisplay = languageOptions.map((languageOption) => (
    <option
      key={languageOption.value}
      value={languageOption.value}
    >
      {languageOption.label}
    </option>
  ));

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setSidebarOpen(true)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="span"
            display={{ xs: 'none', sm: 'block' }}
            className={classes.title}
          >
            <Typography
              variant="h6"
              component={Link}
              to="/"
              style={{
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              Manga Stack
            </Typography>
          </Box>
          <div className={classes.search}>
            <form
              style={{ display: 'inline' }}
              onSubmit={handleSubmit}
            >
              <Tooltip title="Search" aria-label="search-button">
                <IconButton type="submit">
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                </IconButton>
              </Tooltip>
              <InputBase
                placeholder="Search by title..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                inputProps={{ 'aria-label': 'search-input' }}
              />
            </form>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <FormControlLabel
          style={{
            margin: '20px 0'
          }}
          control={
            <Switch
              checked={theme === 'dark'}
              onChange={() => theme === 'light' ? setTheme('dark') : setTheme('light')}
            />
          }
          label="Enable Dark Mode"
        />
        <Divider />
        <List
          className={classes.sidebarList}
          onClick={() => setSidebarOpen(false)}
        >
          {sidebarItemsToDisplay}
        </List>
        <Divider />
        <Box p={2}>
          <Typography variant="h6">
            Settings
          </Typography>
          <List className={classes.sidebarList}>
            <ListItem>
              <FormControlLabel
                control={
                  <Select
                    native
                    value={languageSelectInput}
                    onChange={(e) => {
                      setDialogOpen(true);
                      setLanguageSelectInput(e.target.value);
                    }}
                    inputProps={{
                      name: 'language',
                      id: 'language-select'
                    }}
                    style={{ marginRight: 10 }}
                    fullWidth
                  >
                    {languageOptionsToDisplay}
                  </Select>
                }
                label="Language"
                style={{
                  margin: 0
                }}
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={nsfw}
                    onChange={() => setNSFW(!nsfw)}
                    name="include-nsfw-checkbox"
                  />
                }
                label="Include NSFW results"
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogCancel}
        aria-labelledby="change-language-warning-title"
        aria-describedby="change-language-warning-description"
      >
        <DialogTitle id="change-language-warning-title">
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="change-language-warning-description">
            Changing the default language will result in all of your bookmarks being removed.
            Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>
            No
          </Button>
          <Button onClick={handleDialogConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

Header.propTypes = {
  language: PropTypes.oneOf(languageOptions.map((language) => language.value))
};

Header.defaultProps = {
  language: 'gb'
};

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
  nsfw: state.settings.nsfw,
  language: state.settings.language
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(setTheme(theme)),
  setNSFW: (nsfw) => dispatch(setNSFW(nsfw)),
  setLanguage: (language) => dispatch(setLanguage(language)),
  deleteAllMangaListEntries: () => dispatch(deleteAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);