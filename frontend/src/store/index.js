import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import userReducer from './userReducer';
import slangReducer from './slangReducer';
import idiomReducer from './idiomReducer';
import historyReducer from "./historyReducer";

const rootReducer = combineReducers({
  users: userReducer,
  history: historyReducer,
  idioms: idiomReducer,
  slangs:slangReducer
});

let enhancer;

if (import.meta.env.VITE_NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
