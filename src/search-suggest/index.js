var PouchDB = require('pouchdb');
var db = new PouchDB('https://hypothesis.cloudant.com/hypothesizer');

module.exports = {
  replace: true,
  template: require('./template.html'),
  paramAttributes: ['view', 'placeholder', 'basehref'],
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
    submit: function() {
      location.href = this.basehref + encodeURIComponent(this.results[0].key);
    },
    loadResults: function() {
      var self = this;
      this.results = [];
      db.query(self.view,
        {limit: 10, startkey: [self.search], group_level: 1},
        function(err, resp) {
          self.results = resp.rows;
        });
    }
  },
  filters: {
    encodeURIComponent: function(v) {
      return encodeURIComponent(v);
    }
  }
};
