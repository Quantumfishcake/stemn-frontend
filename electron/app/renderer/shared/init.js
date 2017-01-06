import moment from 'moment';
import 'moment/locale/en-gb';
import 'electron/app/renderer/assets/css/app.global.css';
import http from 'axios';
import initElectronCrash from 'electron/app/shared/reporting/electron-crash/electron-crash.js';
import initRaven from 'electron/app/shared/reporting/raven/raven.renderer.js';

// Assign the global_env to process.env
// GLOBAL_ENV is set in webpack using the definePlugin
if((typeof GLOBAL_ENV !== 'undefined')){
  Object.assign(process.env, GLOBAL_ENV);
}

// Initialise Reporting
initElectronCrash();
initRaven();

moment.locale('en-gb');
http.defaults.baseURL = `${process.env.API_SERVER}/`;
