var PouchDB = require('pouchdb');
var db = new PouchDB(location.protocol + '//' + location.hostname + ':'
    + location.port + '/' + location.pathname.split('/')[1]);

module.exports = {
  replace: true,
  template: require('./template.html'),
  data: function() {
    return {
      search: '',
      results: []
    };
  },
  watch: {
    search: 'loadResults'
  },
  methods: {
    loadResults: function() {
      var self = this;
      this.results = [];
      db.query('hypothesizer/by_user',
        {limit: 10, startkey: [self.search], group_level: 1},
        function(err, resp) {
          self.results = resp.rows;
        });
    }
  }
};
