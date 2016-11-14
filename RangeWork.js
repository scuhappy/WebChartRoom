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
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var config_mail = {
    service: '163',
	port:'25',
    auth: {
        user: '18621300389@163.com',
        pass: 'SpaceX2016'
    },
    tls: {rejectUnauthorized: false},
	debug:true
};
var transporter = nodemailer.createTransport(smtpTransport(config_mail));
var mailOptions = {
  from: "18621300389@163.com", 
  to: "ychen@thorlabs.com", 
  subject: "Hello world", 
  html: "<b>thanks a for visiting!</b>"
}
transporter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error);
  }else{
    console.log("Message sent: " + info.response);
  }
  //smtpTransport.close(); // 如果没用，关闭连接池
});

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

var Persons=['Eason','Jetty','York','Yfu'];
var Startdate = new Date();
Startdate.setFullYear(2016,9,9);//2016.10.9

app.get('/GetRangement',function(req,res){
    console.log("visit date: "+ new Date());
   // var curDate = new Date();
    var start = moment("2016-10-09").week();
    var curWeek = moment().week();
    var durWeek =curWeek- start;
    var tmp = durWeek%4;
    var tmpPerson=Persons.concat();
    for(var i=0;i<tmp;i++)
    {
        var last = tmpPerson[tmpPerson.length-1];
        for(var j=tmpPerson.length-1;j>0;j--)
        {
            tmpPerson[j]=tmpPerson[j-1];
        }
        tmpPerson[0]=last;
        //console.log(tmpPerson);
    }
   var obj={'CurrentDate':moment().format('YYYY-MM-DD'),'CurrentWeek':curWeek,'col1':tmpPerson[0],'col2':tmpPerson[1],'col3':tmpPerson[2],'col4':tmpPerson[3]};
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

