require('insert-css')(require('./semantic-ui/semantic.css'));
require('insert-css')(require('./main.css'));

var Vue = require('vue');
var PouchDB = require('pouchdb');

var db = new PouchDB(location.protocol + '//' + location.hostname + ':'
    + location.port + '/hypothesizer');

window.Hypothesizer = new Vue({
  el: 'body',
  data: {
    total_public: 0,
    users: []
  },
  computed: {
    total_public_users: function() {
      return this.users.length;
    }
  }
});

db.query('hypothesizer/by_created')
  .then(function (res) {
    Hypothesizer.total_public = res['rows'][0]['value'];
  });

db.query('hypothesizer/by_user', {group_level: 1})
  .then(function (res) {
    Hypothesizer.users = res['rows'];
  });
