var express = require('express');
var videoUploadRouter = express.Router();
var Files = {};
var fs = require('fs'),
    exec = require('child_process').exec,
    util = require('util');
//var mysql = require('mysql');
var mysqldb = require('./mysqldb');
//var dbconn = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: '',
//    database: 'unleash'
//});
var uuid = require('node-uuid');
var router = function (nav, server) {
    var io = require('socket.io')(server);

    var videos = [{
            title: 'My Video 1',
            genre: 'Comedy',
            author: 'Test 4'
    }, {
            title: 'My Video 2',
            genre: 'Comedy',
            author: 'Test 4'
    }, {
            title: 'My Video 3',
            genre: 'Comedy',
            author: 'Test 4'
    }, {
            title: 'My Video 4',
            genre: 'Comedy',
            author: 'Test 4'
    }

];

    io.sockets.on('connection', function (socket) {
        console.log('socket taking over');
        //Events will go here

        socket.on('Start', function (data) {
            console.log('socket started receiving file');
            console.log(data);
            var Name = data['Name'];
            Files[Name] = { //Create a new Entry in The Files Variable
                FileSize: data['Size'],
                Data: '',
                Downloaded: 0
            };
            var Place = 0;
            try {
                console.log('socket started receiving file1');
                console.log(data);
                var Stat = fs.statSync('Temp/' + Name);
                if (Stat.isFile()) {
                    console.log('socket started receiving file2');
                    console.log(data);
                    Files[Name]['Downloaded'] = Stat.size;
                    Place = Stat.size / 524288;
                }
            } catch (er) {} //It's a New File
            fs.open('Temp/' + Name, 'a', 0755, function (err, fd) {
                if (err) {
                    console.log('socket started receiving file3');
                    console.log(data);
                    console.log(err);
                } else {
                    console.log('socket started receiving file4');
                    console.log(data);
                    Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                    socket.emit('MoreData', {
                        'Place': Place,
                        Percent: 0
                    });
                }
            });
        });


        socket.on('Upload', function (data) {
            var Name = data['Name'];
            Files[Name]['Downloaded'] += data['Data'].length;
            Files[Name]['Data'] += data['Data'];
            if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
            {
                console.log('file exist');
                fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                    //Get Thumbnail Here
                    var fileName = uuid.v1() + '.mp4';
                    var inp = fs.createReadStream("Temp/" + Name);
                    var out = fs.createWriteStream("./public/Media/" + fileName);
                    inp.pipe(out);
                    inp.on('end', function () {
                        var videorecord = {
                            id: fileName,
                            title: Name,
                            uid: 1,
                            format: 'mp4'
                        };

                        mysqldb.insertVideoinDb(videorecord, function (err) {
                                if (err) return console.log(err)
                                console.log('Data has been loaded...');
                        });
                            //                        dbconn.query('INSERT INTO videos SET ?', videorecord, function (err, res) {
                            //                            if (err) throw err;
                            //                            console.log('Last record insert id:', res.insertId);
                            //                        });
                            //                        
                            //
                            //                        dbconn.end(function(err) {
                            //                            // Function to close database connection
                            //                        });

                        fs.unlink("Temp/" + Name, function () { //This Deletes The Temporary File
                            //Moving File Completed
                            exec("ffmpeg -i ./public/Media/" + Name + " -ss 01:30 -r 1 -an -vframes 1 -f mjpeg ./public/Media/" + Name + ".jpg", function (err) {

                                socket.emit('Done', {
                                    'Image': 'Media/' + fileName
                                });
                            });
                        });
                    });
                });
            } else if (Files[Name]['Data'].length > 10485760) {
                console.log('file exist1'); //If the Data Buffer reaches 10MB
                fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function (err, Writen) {
                    Files[Name]['Data'] = ''; //Reset The Buffer
                    var Place = Files[Name]['Downloaded'] / 524288;
                    var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                    socket.emit('MoreData', {
                        'Place': Place,
                        'Percent': Percent
                    });
                });
            } else {
                console.log('file exist2');
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', {
                    'Place': Place,
                    'Percent': Percent
                });
            }
        });
    });

    videoUploadRouter.route('/')
        .get(function (req, res) {
            res.render('videoUploadView', {
                title: 'Video Upload View',
                nav: nav,
                videos: videos
            });

        });

    videoUploadRouter.route('/:id')
        .get(function (req, res) {
            var id = req.params.id;
            console.log(id);
            res.render('videoUploadView', {
                title: 'Uploaded videos',
                nav: nav,
                book: videos[id]
            });
            // res.send('hello');
        });
    return videoUploadRouter;
};



module.exports = router;