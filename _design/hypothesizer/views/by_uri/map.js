function (doc) {
  var date, year, month, day;
  if ('created' in doc) {
    date = doc.created.split('-');
    year = date[0];
    month = date[1];
    day = date[2].split('T')[0];
  }

  if ('document' in doc && 'link' in doc.document) {
    emit([doc.document.link[0].href, year, month, day], 1);
  } else if ('uri' in doc) {
    emit([doc.uri, year, month, day], 1);
  }
}
