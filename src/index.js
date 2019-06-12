import React from 'react';
import ReactDOM from 'react-dom';
import {createStore } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { init } from 'd2'
import * as config  from './config/Config';
import reducer from './store/reducer';
const store = createStore(reducer);
let baseUrl = process.env.REACT_APP_DHIS2_BASE_URL;
if (!baseUrl) {
    console.warn('Set the environment variable `REACT_APP_DHIS2_BASE_URL` to your DHIS2 instance to override localhost:8080!');
    baseUrl = config.baseUrl;
}

init({baseUrl: baseUrl + '/api'})
    .then(d2 => {
        ReactDOM.render(<Provider store = {store}><App d2={d2}/></Provider>, document.getElementById('root'));
        registerServiceWorker();
    })
    .catch(err => console.error(err));
