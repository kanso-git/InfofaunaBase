import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import i18n from './i18n';
import configureStore from './store/configureStore';

const myStore = configureStore();
const app = (

      <Provider store={myStore}>
          <I18nextProvider i18n={ i18n }>
            <BrowserRouter>
              <App />
            </BrowserRouter>
    </I18nextProvider>
      </Provider>

);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
