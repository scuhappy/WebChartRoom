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


var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var DBTesturl = 'mongodb://localhost:27017/Test';
/*var dbTest = mongoose.connect(DBTesturl,function(err){
    if(!err)
    {
        console.log("Connect to DB Successfully!");
    }else{
        console.log("Error to connect to DB");
    }
});
*/
var Schema = mongoose.Schema;
var MsgBoardScheMa = new Schema({
                                    UserName: String,
                                    Date:String,
                                    Message: String

                                });

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
    var durWeek =curWeek- start;
    var tmp = durWeek%3;
    var tmpPerson=Persons.concat();
    for(var i=0;i<tmp;i++)
    {
        var last = tmpPerson[tmpPerson.length-1];
        for(var j=tmpPerson.length-1;j>0;j--)
        {
            tmpPerson[j]=tmpPerson[j-1];
        }
        tmpPerson[0]=last;
        console.log(tmpPerson);
    }
   var obj={'CurrentDate':moment().format('YYYY-MM-DD'),'CurrentWeek':curWeek,'col1':tmpPerson[0],'col2':tmpPerson[1],'col3':tmpPerson[2]};
  res.end(JSON.stringify(obj));
});
function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };
var server = app.listen(80,"chn-vm-70", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("listen on  http://%s:%s", host, port);

})
var io = require('socket.io')(server);
var UserCount = 0;
var CharList = [];
io.on('connection', function(socket){
       console.log('a user connected ip : '+socket.handshake.address);
       UserCount++;
       socket.emit("Client IP", socket.handshake.address);
       io.emit('ClientNumber',io.engine.clientsCount);
        for(var i = 0;i< CharList.length;i++)
        {
            socket.emit('init message', CharList[i]);
        }

    socket.on('chat message', function(msg){
        var chartObj = JSON.parse(msg);
        chartObj.IP =  socket.handshake.address;
        chartObj.Time = moment().format('HH:mm:ss');
        CharList [CharList.length] = JSON.stringify(chartObj);
        console.log('message: ' +JSON.stringify(chartObj));
         io.emit('chat message', JSON.stringify(chartObj));
      });
    io.on('disconnect',function(socket){
        console.log("disconnect!") ;
         io.emit('ClientNumber',io.engine.clientsCount);
        UserCount--;
    });
});

