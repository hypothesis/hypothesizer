function(doc) {
  if ('user' in doc) {
    var date = doc.created.split('-');
    var year = date[0];
    var month = date[1];
    var day = date[2].split('T')[0];
    emit([doc.user.split('acct:')[1], year, month, day], 1);
  }
}
