// JavaScript source code
use svcc
db.notes0.find({}).forEach(function(doc){db.notes.save(doc)})
