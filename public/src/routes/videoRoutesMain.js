var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbconn;

router.use('/*', function (req, res, next) {
    console.log('Time: ' + Date.now());
    dbconn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'unleash'
    });
    next();
});

router.route('/')
    .get(function (req, res) {
        console.log("video router called with nav" + req.nav);
        var videos = [];
        if (!dbconn) console.log("connection not created");
        dbconn.query('SELECT * from videos where uid = ?', [1], function (err, results) {
            if (err) throw err;
            videos = results
            console.log(results);
            res.render('videoView', {
                title: 'Video Upload View',
                nav: req.nav,
                videos: videos
            });
            console.log(videos);
        });
    });

module.exports = router;