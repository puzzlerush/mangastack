import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import MangaPage from '../components/MangaPage';
import Header from '../components/Header';
import ReadChapterPage from '../components/ReadChapterPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
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