import { ipcRenderer } from 'electron';
import { loadUserData } from 'app/shared/actions/auth.js';
import http from 'axios';

export default (store, rendererType) => {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });


  // Dispatch some initialisation actions
  const state = store.getState();

  // Setup the http interceptor
  http.interceptors.request.use(config => {
    const token = store.getState().auth.authToken;
    if (!config.headers.Authorization) {
      config.headers.Authorization = token ? `bearer ${token}` : ''
    }
    return config;
  });

  if(rendererType == 'main' && state.auth.authToken){
    setTimeout(() => store.dispatch(loadUserData()), 1)
  }
}
