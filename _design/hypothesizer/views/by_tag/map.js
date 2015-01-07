function(doc) {
  if ('tags' in doc && doc.tags.length > 0) {
    for (var i = 0; i < doc.tags.length; i++) {
      emit(doc.tags[i], 1);
    }
  }
}
