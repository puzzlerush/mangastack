import { createStore, combineReducers } from 'redux';
import themeReducer from '../reducers/theme';

const configureStore = () => {
  const rootReducer = combineReducers({
    theme: themeReducer
  });
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  return store;
}

export default configureStore;