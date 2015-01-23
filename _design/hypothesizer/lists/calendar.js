/**
 * List function - use `start()` and `send()` to output headers and content.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#listfun
 *
 * @param {object} head - View Head Information. http://docs.couchdb.org/en/latest/json-structure.html#view-head-info-object
 * @param {object} req - Request Object. http://docs.couchdb.org/en/latest/json-structure.html#request-object
 **/
function(head, req) {
  var moment = require('lib/moment');
  var ddoc = this;
  start({
    'headers': {
      'Content-Type': 'text/html'
    }
  });
  var user = false;
  var dates = {};
  while (row = getRow()) {
    // TODO: assumes array-based key...
    if (row.key[0].search('@') != -1) {
      user = row.key[0];
      // first key is the user name, so skip it
      // TODO: make this dumber / unmix concerns
      dates[row.key[1] + '-' + row.key[2] + '-' + row.key[3]] = row.value;
    } else {
      dates[row.key[0] + '-' + row.key[1] + '-' + row.key[2]] = row.value;
    }
  }
  send(ddoc.templates.header);
  var weeks_count = Number(req.query['weeks']) || 52;
  send('<div class="ui one column grid"><div class="column">');
  send('<table class="ui unstackable table">');
  send('<tr><thead>');
  send('<th class="disabled one wide">Week</th>');
  var weekdays = moment.weekdays();
  for (var i = 0; i < 7; i++) {
    send('<th>' + weekdays[i] + '</th>');
  }
  send('</thead></tr>');
  send('<tbody><tr>');
  var today = moment();
  var day = moment().subtract(weeks_count-1, 'weeks').startOf('week');
  var first = true;
  for (var j = 0; j < weeks_count; j++) {
    send('<td class="disabled">' + day.week() + '</td>');
    for (var i = 0; i < 7; i++) {
      var stat = dates[day.format('YYYY-MM-DD')] || '';
      send('<td title="' + day.calendar('YYYY-MM-DD') + '" class="month' + day.month() + '"'
          + (day.date() == 1 || first ? ' style="position: relative"' : '') + '>');
      if (day.date() == 1 || first) {
        send('<span class="ui top right attached label">'
            + day.format('MMM') + '</span>');
        first = false;
      }
      if (user && stat > 0) {
        send('<a href="users/' + user + '/' + day.format('YYYY/MM/DD') + '">');
      }
      if (day.format('YYYY-MM-DD') == today.format('YYYY-MM-DD')) {
        send('<strong>' + stat + '</strong>');
      } else {
        send(stat);
      }
      if (user && stat > 0) {
        send('</a>');
      }
      send('</td>');
      day.add(1, 'd');
    }
    send('</tr><tr>');
  }
  send('</tr></tbody>');
  send('</table>');
  send('</div></div>');
  send(ddoc.templates.footer);
}
