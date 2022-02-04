// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { settings } from './settings';

export const environment = {
    production: false,
    appSettings: settings,
    //baseURL: 'https://paintcityincapi.azurewebsites.net/api/',
    baseURL: 'https://localhost:5201/api/',
    googleMapApiKey: 'AIzaSyC7luiVCG5a9qVypnjIE-EJzMNOBiw0X38',
    idleTimeInMinutes: 1000,
    firebase: {
        apiKey: 'AIzaSyBjHU1XkLXNHDS4za80MLA0-ePqow8SEi0',
        authDomain: 'assist-angular.firebaseapp.com',
        databaseURL: 'https://assist-angular.firebaseio.com',
        projectId: 'assist-angular',
        storageBucket: 'assist-angular.appspot.com',
        messagingSenderId: '126593393147',
        appId: '1:126593393147:web:ae499e70ea8b40c5'
    },
    version: 'Version 3.75 Feb 04 2022'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
