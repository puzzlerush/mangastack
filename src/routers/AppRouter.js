import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import MangaPage from '../components/MangaPage';
import Header from '../components/Header';
import ReadChapterPage from '../components/ReadChapterPage';
import SearchPage from '../components/SearchPage';
import CurrentlyReadingPage from '../components/CurrentlyReadingPage';
import HomePage from '../components/HomePage';
import AllMangaPage from '../components/AllMangaPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/search">
          <SearchPage />
        </Route>
        <Route path="/currently-reading">
          <CurrentlyReadingPage />
        </Route>
        <Route path="/manga/all">
          <AllMangaPage />
        </Route>
        <Route path="/manga/:id" exact>
          <MangaPage />
        </Route>
        <Route path="/manga/:mangaId/chapter/:chapterId">
          <ReadChapterPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;