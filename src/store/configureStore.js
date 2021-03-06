import { createStore, combineReducers } from 'redux';
import settingsReducer from '../reducers/settings';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {}
};

const persistedState = loadState();

const configureStore = () => {
  const rootReducer = combineReducers({
    settings: settingsReducer
  });

  const store = createStore(
    rootReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  store.subscribe(() => {
    saveState(store.getState());
  });
  
  return store;
};

export default configureStore;