import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();

const AllTheProviders = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

const customRender = (ui, options) => (
  render(ui, { wrapper: AllTheProviders, ...options })
);

export * from '@testing-library/react';

export { customRender as render };