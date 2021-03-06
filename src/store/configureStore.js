import { createStore, combineReducers } from 'redux';
import settingsReducer from '../reducers/settings';

const configureStore = () => {
  const rootReducer = combineReducers({
    settings: settingsReducer
  });
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  return store;
}

export default configureStore;