http =  require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var moment = require('moment');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer  = require('multer');
var urlencodeParser = bodyParser.urlencoded({extended: true});

app.use(cookieParser());
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extended:false}));

var Persons=['York','Jetty','Eason'];
var Startdate = new Date();
Startdate.setFullYear(2016,8,4);//2016.9.4
app.get('/GetRangement',function(req,res){
    console.log("visit date: "+ new Date());
   // var curDate = new Date();
    var start = moment("2016-09-04").week();
    var curWeek = moment().week();
    console.log("start week : " +start);
    console.log("current week : "+curWeek);
    var durWeek =curWeek- start;
    var tmp = durWeek%3;

    console.log("dur week :"+ durWeek);
    for(var i=0;i<tmp;i++)
    {
        var last = Persons[Persons.length-1];
        for(var j=Persons.length-1;j>0;j--)
        {
            Persons[j]=Persons[j-1];
        }
        Persons[0]=last;
        console.log(Persons);
    }
   var obj={'CurrentDate':moment().format('YYYY-MM-DD'),'CurrentWeek':curWeek,'col1':Persons[0],'col2':Persons[1],'col3':Persons[2]};
  res.end(JSON.stringify(obj));
});

var server = app.listen(80,"10.15.10.166", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("listen on  http://%s:%s", host, port);

})
var io = require('socket.io')(server);
var UserCount = 0;
io.on('connection', function(socket){
       console.log('a user connected');
       UserCount++;
       io.emit('ClientNumber',io.engine.clientsCount);
//    console.log(io.rooms.length);
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
         io.emit('chat message', msg);
      });
    io.on('disconnect',function(socket){
        console.log("disconnect!") ;
         io.emit('ClientNumber',io.engine.clientsCount);
        UserCount--;
    });
});

