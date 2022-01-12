import { settings } from './settings';

export const environment = {
  production: true,
  appSettings: settings,
  baseURL: 'https://paintcityincapi.azurewebsites.net/api/',
  googleMapApiKey: 'AIzaSyC7luiVCG5a9qVypnjIE-EJzMNOBiw0X38',
  idleTimeInMinutes: 60,
  firebase: {
    apiKey: 'AIzaSyBjHU1XkLXNHDS4za80MLA0-ePqow8SEi0',
    authDomain: 'assist-angular.firebaseapp.com',
    databaseURL: 'https://assist-angular.firebaseio.com',
    projectId: 'assist-angular',
    storageBucket: 'assist-angular.appspot.com',
    messagingSenderId: '126593393147',
    appId: '1:126593393147:web:ae499e70ea8b40c5'
  },
  version: 'Version 3.74 Jan 05 2022'
};