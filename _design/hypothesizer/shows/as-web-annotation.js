function(doc, req) {
  var fromHypothesis = require('lib/from-hypothesis').from;

  function toWebAnnotation() {
    return {
      headers: {
        'Content-Type': 'application/ld+json;profile=http://www.w3.org/ns/anno.jsonld'
      },
      body: JSON.stringify(fromHypothesis(doc))
    };
  }

  provides('json', function() {
    return JSON.stringify(doc);
  });

  registerType('json-ld', 'application/ld+json');
  provides('json-ld', toWebAnnotation);

  registerType('web-annotation', 'application/ld+json;profile=http://www.w3.org/ns/anno.jsonld');
  provides('web-annotation', toWebAnnotation);
}
