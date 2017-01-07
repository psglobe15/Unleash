var mysql = require('mysql');
var dbconnect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'unleash'
});

function insertVideoinDb (data, done) {
    var dbconn = dbconnect;
    if (!dbconn) console.log("connection not created");
    dbconn.query('INSERT INTO videos SET ?', data, function (err, res) {
        if (err) throw err;
    });

    dbconn.end(function (err) {
        // Function to close database connection
    });
    
    done();
};

function fetchVideoFromDb (uid, done) {
    var dbconn = dbconnect;
    if (!dbconn) console.log("connection not created");
    dbconn.query('SELECT * from videos where uid = ?', [uid], function (err, res) {
        if (err) throw err;
        //console.log(res);
        return res;
    });

    dbconn.end(function (err) {
        // Function to close database connection
    });
    
    done();
};

function fetchAllVideosFromDb(done) {
    var dbconn = dbconnect;
    if (!dbconn) console.log("connection not created");
    dbconn.query('SELECT * from videos',  function (err, res) {
        if (err) throw err;
    });

    dbconn.end(function (err) {
        // Function to close database connection
    });
    
    done();
};


module.exports.insertVideoinDb = insertVideoinDb;
module.exports.fetchVideoFromDb = fetchVideoFromDb;
module.exports.fetchAllVideosFromDb = fetchAllVideosFromDb;