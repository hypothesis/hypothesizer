function (doc) {
  if ('document' in doc && 'link' in doc.document) {
    emit(doc.document.link[0].href, 1);
  } else if ('uri' in doc) {
    emit(doc.uri, 1);
  }
}
