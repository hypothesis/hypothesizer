/**
 * List function - use `start()` and `send()` to output headers and content.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#listfun
 *
 * @param {object} head - View Head Information. http://docs.couchdb.org/en/latest/json-structure.html#view-head-info-object
 * @param {object} req - Request Object. http://docs.couchdb.org/en/latest/json-structure.html#request-object
 **/
function(head, req) {
  var ddoc = this;
  start({
    'headers': {
      'Content-Type': 'text/html'
    }
  });
  send(ddoc.templates.header);
  send('<div class="ui one column grid"><div class="column">');
  send('<table class="ui stripped table">');
  while (row = getRow()) {
    send('<tr>');
    if (typeof(row.key) !== 'string') {
      for (var i = 0; i < row.key.length; i++) {
        send('<td><a href="/' + req.requested_path.join('/')
            + '/' + row.key[i] + '">' + row.key[i] + '</a></td>');
      }
      send('<td>' + row.value + '</td>');
    }
    send('</tr>');
  }
  send('</table>');
  send('</div></div>');
  send(ddoc.templates.footer);
}
