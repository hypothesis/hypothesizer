require('insert-css')(require('./main.css'));

var Vue = require('vue');
var PouchDB = require('pouchdb');

var db = new PouchDB(location.protocol + '//' + location.hostname + ':'
    + location.port + '/hypothesizer');

Vue.filter('limit',
  function (list, n) {
    return list.slice(0, n);
  });

Vue.filter('truncate',
  function (s, n) {
    var sliced = s.slice(0, n);
    if (sliced !== s) {
      return sliced + '...';
    } else {
      return s;
    }
  });

window.Hypothesizer = new Vue({
  el: 'body',
  data: {
    total_public: 0,
    total_public_tags: 0,
    users: [],
    uris: [],
  },
  computed: {
    total_public_users: function() {
      return this.users.length;
    },
    total_public_uris: function() {
      return this.uris.length;
    },
    top_uris: function() {
      // sort uris by value
      // return top 100 from the list
    }
  },
  components: {
    'search-suggest': require('./search-suggest')
  }
});

db.query('hypothesizer/by_created')
  .then(function (res) {
    Hypothesizer.total_public = res['rows'][0]['value'];
  });

db.query('hypothesizer/by_tag', {group: true})
  .then(function (res) {
    Hypothesizer.total_public_tags = res['rows'].length;
  });

db.query('hypothesizer/by_user', {group_level: 1})
  .then(function (res) {
    Hypothesizer.users = res['rows'];
  });

db.query('hypothesizer/by_uri', {group: true})
  .then(function (res) {
    Hypothesizer.uris = res['rows'];
  });
