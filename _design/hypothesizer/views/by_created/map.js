function(doc) {
  if ('created' in doc) {
    var date = doc.created.split('-');
    var year = date[0];
    var month = date[1];
    var day = date[2].split('T')[0];
    emit([year, month, day], 1);
  }
}
