import { render } from '@testing-library/react';
import Loader from '../Loader';

it('should render', () => {
  const container = render(<Loader />).container;
  expect(container).toMatchSnapshot();
});