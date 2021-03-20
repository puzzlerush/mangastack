import { MemoryRouter, Route } from 'react-router-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import PageNavigation from '../PageNavigation';

let container;
let rerender;
let component;
let testLocation;
beforeEach(() => {
  window.scrollTo = jest.fn();
  component = (page, top = true) => (
    <MemoryRouter initialEntries={['/all?page=2']}>
      <PageNavigation
        topOfPage={top}
        nextLink={`/all?page=${page + 1}`}
        prevLink={`/all?page=${page - 1}`}
        disableNext={page >= 5}
        disablePrev={page <= 1}
      />
      <Route 
        path="*"
        render={({ location }) => {
          testLocation = location;
          return null;
        }}
      />
    </MemoryRouter>
  );
  ({ container, rerender } = render(component(2)));
});

afterEach(cleanup);

it('should render', () => {
  expect(container).toMatchSnapshot();
});

it('should not disable previous and next page buttons when on a middle page', () => {
  const nextButton = screen.getByText('Next');
  const prevButton = screen.getByText('Prev');
  expect(nextButton.closest('a').getAttribute('aria-disabled')).toBe('false');
  expect(prevButton.closest('a').getAttribute('aria-disabled')).toBe('false');
});

it('should navigate to the next page', () => {
  const nextButton = screen.getByText('Next');
  fireEvent.click(nextButton);
  const searchParams = new URLSearchParams(testLocation.search)
  expect(searchParams.has('page')).toBe(true);
  expect(searchParams.get('page')).toBe('3');
});

it('should navigate to the previous page', () => {
  const prevButton = screen.getByText('Prev');
  fireEvent.click(prevButton);
  const searchParams = new URLSearchParams(testLocation.search)
  expect(searchParams.has('page')).toBe(true);
  expect(searchParams.get('page')).toBe('1');
});

it('should disable the next button on the last page', () => {
  rerender(component(5));
  expect(screen.getByText('Next').closest('a').getAttribute('aria-disabled')).toBe('true');
});

it('should disable the previous button on the first page', () => {
  rerender(component(1));
  expect(screen.getByText('Prev').closest('a').getAttribute('aria-disabled')).toBe('true');
});

it('should display a scroll to bottom button if it is at the top of the page', () => {
  const scrollToBottomButton = screen.getByText('Scroll to Bottom');
  expect(scrollToBottomButton).toBeInTheDocument();
  fireEvent.click(scrollToBottomButton);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'smooth', left: 0, top: 0 });
});

it('should display a scroll to top button if it is at the bottom of the page', () => {
  rerender(component(2, false));
  const scrollToTopButton = screen.getByText('Scroll to Top');
  expect(scrollToTopButton).toBeInTheDocument();
  fireEvent.click(scrollToTopButton);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ behavior: 'smooth', left: 0, top: 0 });
});
