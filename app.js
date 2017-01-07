var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 5000;
var uuid = require('node-uuid');
var mysql = require('mysql');
app.disable('view cache');
var nav = [{
        Link: '/videos#'+uuid.v1(),
        Text: 'videos'
        },
    {
        Link: '/upload',
        Text: 'Upload'
    }];
app.use(function(req, res, next) {
    req.nav = nav;
  console.log('%s %s', req.method, req.url);
  next();
});

var dbconn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'unleash'
});
app.use(express.static('public'));
var videoRouter = require('./public/src/routes/videoRoutes')(nav);
//var videoRouterMain = require('./public/src/routes/videoRoutesMain');
var videoUploadRouter = require('./public/src/routes/videoUploadRoutes')(nav, server);
app.set('views', 'public/src/views');
app.set('view engine', 'ejs');

//app.use('/videos', function(req, resp, next){
//    console.log("video router called");
//    var videos = [];
//    if (!dbconn) console.log("connection not created");
//    dbconn.query('SELECT * from videos where uid = ?', [1], function (err, res) {
//        if (err) throw err;
//        videos = res
//        console.log(res);
//        resp.render('videoView', {
//                title: 'Video Upload View',
//                nav: nav,
//                videos: videos
//    });
//    
//    console.log(videos);
//    
//    });
//});


app.use('/videos', videoRouter);
//app.use('/videos', videoRouterMain);
app.use('/upload', videoUploadRouter);

app.get('/video', function (req, res) {
    res.send('hello video');
});

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Hello this is index',
        nav: nav
    });
});

server.listen(port, function (err) {
    console.log('Listening on port: ' + port);

});
