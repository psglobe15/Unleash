var express = require('express');
var videoRouter = express.Router();
var mysql = require('mysql');
var dbconn;


var router = function (nav) {
    console.log("video router called");
    //    var videos = [];
    //    if (!dbconn) console.log("connection not created");
    //    dbconn.query('SELECT * from videos where uid = ?', [1], function (err, res) {
    //        if (err) throw err;
    //        videos = res
    //        //console.log(res);
    //    });

    //    dbconn.end(function (err) {
    //        // Function to close database connection
    //    });

    //  console.log(videos);

    //    var videos = [{
    //            title: 'My Video 1',
    //            genre: 'Comedy',
    //            author: 'Test 4'
    //    }, {
    //            title: 'My Video 2',
    //            genre: 'Comedy',
    //            author: 'Test 4'
    //    }, {
    //            title: 'My Video 3',
    //            genre: 'Comedy',
    //            author: 'Test 4'
    //    }, {
    //            title: 'My Video 4',
    //            genre: 'Comedy',
    //            author: 'Test 4'
    //    }
    //];

    videoRouter.route('/')
        .all(function (req, res, next) {
            dbconn = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'unleash'
            });
            next();
        })
        .get(function (req, res) {
            var videos = [];
            if (!dbconn) console.log("connection not created");
            dbconn.query('SELECT * from videos where uid = ?', [1], function (err, resp) {
                if (err) throw err;
                videos = resp
                    //console.log(res);
                res.render('videoView', {
                    title: 'Video Upload View',
                    nav: nav,
                    videos: videos
                });
                dbconn.end();
            });


        });

    videoRouter.route('/:id')
        .get(function (req, res) {
            var id = req.params.id;
            console.log(id);
            res.render('videoView', {
                title: 'Uploaded videos',
                nav: nav,
                book: videos[id]
            });
            // res.send('hello');
        });

    return videoRouter;
};


module.exports = router;