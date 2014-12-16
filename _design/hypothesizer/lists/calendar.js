/**
 * List function - use `start()` and `send()` to output headers and content.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#listfun
 *
 * @param {object} head - View Head Information. http://docs.couchdb.org/en/latest/json-structure.html#view-head-info-object
 * @param {object} req - Request Object. http://docs.couchdb.org/en/latest/json-structure.html#request-object
 **/
function(head, req) {
  var moment = require('lib/moment');
  start({
    'headers': {
      'Content-Type': 'text/html'
    }
  });
  var dates = {};
  while (row = getRow()) {
    // TODO: assumes array-based key...
    if (row.key[0].search('@') != -1) {
      // first key is the user name, so skip it
      // TODO: make this dumber / unmix concerns
      dates[row.key[1] + '-' + row.key[2] + '-' + row.key[3]] = row.value;
    } else {
      dates[row.key[0] + '-' + row.key[1] + '-' + row.key[2]] = row.value;
    }
  }
  send('<html><body>');
  var weeks_count = Number(req.query['weeks']) || 52;
  send('<table>');
  send('<tr>');
  send('<th>Week</th>');
  var weekdays = moment.weekdays();
  for (var i = 0; i < 7; i++) {
    send('<th>' + weekdays[i] + '</th>');
  }
  send('</tr>');
  send('<tr>');
  var today = moment();
  var day = moment().subtract(weeks_count-1, 'weeks').startOf('week');
  for (var j = 0; j < weeks_count; j++) {
    send('<td>' + day.week() + '</td>');
    for (var i = 0; i < 7; i++) {
      var stat = dates[day.format('YYYY-MM-DD')] || '';
      send('<td title="' + day.calendar() + '">');
      if (day.format('YYYY-MM-DD') == today.format('YYYY-MM-DD')) {
        send('<strong>' + stat + '</strong>');
      } else {
        send(stat);
      }
      send('</td>');
      day.add(1, 'd');
    }
    send('</tr><tr>');
  }
  send('</tr>');
  send('</table>');
  send('</body></html>');
}
