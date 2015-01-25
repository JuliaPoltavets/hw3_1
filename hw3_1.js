function selectTheLowestHomeworkScore(scoresArray){

function sortObject(obj) {
  var arr = obj;
  arr.sort(function(a, b) { return b.score - a.score; });
  return arr;
}

function addFilteredHWItemsToResult(array)
{
  if(array.length == 0) return;
  for(var i=0;i<array.length;i++)
  {
    updatedScoresArray.push(array[i]);
  }
}

var updatedScoresArray = [];
var homeworkArray = [];

for (var i =0; i<scoresArray.length;i++)
{
  var cursorObject = scoresArray[i];
  if (cursorObject.type != "homework") updatedScoresArray.push(cursorObject);
  else{
    homeworkArray.push(cursorObject);
  }
}
var sortedHWArray = sortObject(homeworkArray);
sortedHWArray.pop();

addFilteredHWItemsToResult(sortedHWArray);
return updatedScoresArray;
}

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
  if(err) throw err;

  db.collection('students').find({}).toArray(function(err,docs){
    if(err) throw err;
    var callbacksCount = 0;
    docs.forEach(function(doc){
      doc.scores = selectTheLowestHomeworkScore(doc.scores);
      db.collection('students').update({'_id':doc._id}, doc, {}, function(err, result) {
        if (err) throw err;
        console.dir("Updated: " + result + " documents");
        if (++callbacksCount == docs.length) db.close();
      });
    });

  });

});
