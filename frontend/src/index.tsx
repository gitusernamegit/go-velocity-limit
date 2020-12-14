import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { configureStore } from './store/Store';
import { Provider } from 'react-redux';


const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);