/**
 * List function - use `start()` and `send()` to output headers and content.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#listfun
 *
 * @param {object} head - View Head Information. http://docs.couchdb.org/en/latest/json-structure.html#view-head-info-object
 * @param {object} req - Request Object. http://docs.couchdb.org/en/latest/json-structure.html#request-object
 **/
function(head, req) {
  var moment = require('lib/moment');
  var Handlebars = require('lib/handlebars');
  var ddoc = this;
  start({
    'headers': {
      'Content-Type': 'text/html'
    }
  });
  send(ddoc.templates.header);
  send('<div class="ui one column page grid"><div class="column"></div><div class="column">');
  send('<div class="ui one cards">');
  var current_date = false;
  while (row = getRow()) {
    var created = moment(row.doc.created).format('YYYY/MM/DD');
    if (current_date != created) {
      send('<div class="ui header">' + moment(row.doc.created).calendar() + '</div>');
      current_date = created;
    }
    send(Handlebars.compile(ddoc.templates.annotation)(row.doc));
  }
  send('</div></div></div>');
  send(ddoc.templates.footer);
}
