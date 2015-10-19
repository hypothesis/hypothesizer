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
      'Content-Type': 'application/atom+xml'
    }
  });

  var next = Number(req.query.skip || 0) + Number(req.query.limit);

  var feed_title = "Hypothes.is Stream";
  if ('user' in req.query) {
    feed_title = req.query.user + " Hypothes.is Stream";
  }

  var output = {
    feed: {
      title: feed_title,
      subtitle: "The Web. Annotated.",
      id: "http://hypothes.is/stream",
      _links: {
        "self": {
          href: "http://assay.hypothes.is/atom"
        },
        "next": {
          href: "http://assay.hypothes.is/atom?skip=" + next
        },
        "alternate": {
          href: "https://hypothes.is/stream",
          type: "text/html"
        }
      }
    }
  };
  var entries = [];
  var updated = moment().toISOString();
  while (row = getRow()) {
    user = row.doc.user.replace('acct:', '');
    updated = moment(row.doc.created).toISOString();
    content_doc = row.doc;
    content_doc.user = user;
    title = 'Annotation by ' + user + ' on ';
    if ('document' in row.doc && 'title' in row.doc['document']) {
      title += row.doc['document'].title;
    } else {
      title += row.doc.uri;
    }
    entries.push({
      id: row.doc._id,
      title: title,
      updated: updated,
      content: Handlebars.compile(ddoc.templates['annotation-content'])(content_doc),
      author: {
        name: user
      },
      _links: {
        'self': {
          type: "text/html",
          href: "https://hypothes.is/a/" + row.doc.id
        },
        alternate: {
          type: "application/json",
          href: "https://hypothes.is/api/annotations/" + row.doc.id
        }
      }
    });
  }
  output.feed.entries = entries;
  // use last result of updated
  output.feed.updated = updated;
  send(Handlebars.compile(ddoc.templates.atom)(output));
}
