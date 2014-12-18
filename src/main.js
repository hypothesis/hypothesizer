require('insert-css')(require('./semantic-ui/css/semantic.css'));
require('insert-css')(require('./main.css'));

var Vue = require('vue');
var PouchDB = require('pouchdb');

var db = new PouchDB(location.protocol + '//' + location.hostname + ':'
    + location.port + '/hypothesizer');

window.Hypothesizer = new Vue({
  el: 'body'
});
