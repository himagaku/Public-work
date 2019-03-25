// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE Dreams (dream TEXT, create_datetime TEXT)');
    console.log('New table Dreams created!');
    
    // insert default dreams
    db.serialize(function() {
      db.run('INSERT INTO Dreams (dream, create_datetime) VALUES ("Find and count some sheep", datetime("now", "localtime")), ("Climb a really tall mountain", datetime("now", "localtime")), ("Wash the dishes", datetime("now", "localtime"))');
    });
  }
  else {
    console.log('Database "Dreams" ready to go!');
    db.each('SELECT * from Dreams', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get('/getDreams', function(request, response) {
  db.all('SELECT * from Dreams', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

app.get('/resetDreams', function(request, response) {
  db.run('DELETE FROM Dreams');
  db.all('SELECT * from Dreams', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

app.post('/', function(request, response) {
  console.log(request.body.dream);
  db.run('INSERT INTO Dreams (dream, create_datetime) VALUES ("' + request.body.dream + '", datetime("now", "localtime"))');
  response.status(200).send();
  response.end();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
