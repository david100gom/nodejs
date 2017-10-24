// server.js
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/',function(req, res){  //2
    res.sendFile(__dirname + '/client.html');
});

app.post('/beacon',function(req, res){  //2
    io.emit("receive message", 'SUUID : '+req.body.SUUID+', 위도 : '+req.body.lat+', 경도 :'+req.body.lng);
    io.emit("receive message", "----------------------------------------------------------------------------------------------------------");
    res.send({ "result" : 1});
});

var count=1;
io.on('connection', function(socket){ //3
    console.log('user connected: ', socket.id);  //3-1
    var name = "user" + count++;                 //3-1
    io.to(socket.id).emit('change name',name);   //3-1

    socket.on('disconnect', function(){ //3-2
        console.log('user disconnected: ', socket.id);
    });

    socket.on('send message', function(name,text){ //3-3
        var msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
    });
});

http.listen(3000, function(){ //4
    console.log('server on!');
});