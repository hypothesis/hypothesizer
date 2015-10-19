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
  Handlebars.registerHelper('encodeURI', function(uri) {
    return encodeURIComponent(uri);
  });
  var ddoc = this;
  start({
    'headers': {
      'Content-Type': 'text/html'
    }
  });
  send(ddoc.templates.header);
  send('<div class="ui one column page grid"><div class="column"></div><div class="column">');
  send('<div class="ui one cards">');
  send('<div class="ui huge breadcrumb">');
  if (req.path.indexOf('by_tag') > -1) {
    send('<a class="section" href="tags/">Tags</a>');
    send('<div class="divider"> &gt; </div>');
    send('<div class="active section">' + req.query.key + '</div>');
  } else if (req.path.indexOf('by_user') > -1) {
    send('<a class="section" href="user/">Users</a>');
    var url = 'users/';
    for (var i = 0; i < req.query.startkey.length; i++) {
      send('<div class="divider"> &gt; </div>');
      if (i == req.query.startkey.length - 1) {
        send('<div class="active section">' + req.query.startkey[i] + '</div>');
      } else {
        send('<div class="section"><a href="' + (url = url + '/' + req.query.startkey[i]) + '">' + req.query.startkey[i] + '</a></div>');
      }
    }
  }
  send('</div>');

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
