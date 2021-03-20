import { MemoryRouter, Route } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import MangaTile, { getShortText, getShortAuthors } from '../MangaTile';
import topRatedManga from '../../assets/topRatedManga';

let container;
let mockManga;
let component;
let testLocation;

beforeEach(() => {
  mockManga = topRatedManga[0];
  component = (
    <MemoryRouter initialEntries={['/']}>
      <MangaTile {...mockManga} />
      <Route 
        path="*"
        render={({ location }) => {
          testLocation = location;
          return null;
        }}
      />
    </MemoryRouter>
  );
  container = render(component).container;
});

afterEach(cleanup);

it('should render', () => {
  expect(container).toMatchSnapshot();
});

it('displays title, synopsis, authors, and views', () => {
  const title = screen.getByText(getShortText(mockManga.title, 50));
  expect(title).toBeInTheDocument();

  const synopsis = screen.getByText(getShortText(mockManga.description, 150));
  expect(synopsis).toBeInTheDocument();
  
  const authors = screen.getByText(getShortAuthors(mockManga.author, mockManga.artist));
  expect(authors).toBeInTheDocument();
  
  const views = screen.getByText(`${mockManga.views.toLocaleString()} views`);
  expect(views).toBeInTheDocument();
});

it('displays cover image', () => {
  const image = container.querySelector(`img[title="Cover for ${mockManga.title}"]`);
  expect(image.getAttribute('src')).toBe(mockManga.mainCover);
});

it('title links to the manga page', () => {
  const title = screen.getByText(getShortText(mockManga.title, 50));
  fireEvent.click(title);
  expect(testLocation.pathname).toBe(`/manga/${mockManga.id}`);
});

it('main cover links to the manga page', () => {
  const image = container.querySelector(`img[title="Cover for ${mockManga.title}"]`);
  fireEvent.click(image);
  expect(testLocation.pathname).toBe(`/manga/${mockManga.id}`);
});
