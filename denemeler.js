var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'isyerim',
  password: 'isyerim',
  database: 'isyerim',
});

db.connect(function(err) {
  if (err) throw err;
  db.query("SELECT * FROM ogrenci", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
