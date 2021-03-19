import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, screen } from '@testing-library/react';
import MangaTile, { getShortText, getShortAuthors } from '../MangaTile';
import topRatedManga from '../../assets/topRatedManga';

let container;
let mockManga;
let component;
beforeEach(() => {
  mockManga = topRatedManga[0];
  component = (
    <MemoryRouter>
      <MangaTile {...mockManga} />
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

