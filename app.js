
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var util=require('util');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connect = require('connect');

var routes = require('./routes');
//var User = require('./modules/user.js');	
var settings=require('./Settings');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 8484);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser());
app.use(bodyParser.urlencoded());
//app.use(methodOverride());
app.use(cookieParser());
app.use(flash());
app.use(session({
	"secret":settings.cookieSecret,
	"store":new MongoStore({
		db:settings.db
	})
}));

app.use(function(req, res, next){
  console.log("访问地址："+req.originalUrl);
  var url = req.originalUrl;
  
  //简单地定义一个登录拦截器
  if ((url == "/month" || url=="/stat" || url=='/list' || url=='/record') && !req.session.user) {
  	  console.log("登录拦截器提示：必须登录，才能执行此项操作。");
  	  req.flash('error', '请先登录。');
      return res.redirect("/login");
  }
  
  res.locals.user = req.session.user;
  
  var error = req.flash('error');
  res.locals.error = error.length?error:null;
  //console.log("转移flash中的error值："+error);
  
  var success = req.flash('success');
  res.locals.success = success.length?success:null;
  //console.log("转移flash中的success值："+success);
  
  res.locals.session = req.session;
  next();
});

//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
//console.log(util.inspect(app));

// development only
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//console.log('注册路由.');

routes(app);


http.createServer(app).listen(app.get('port'), function(){
	console.log();
	console.log();
	console.log('/**************************************************/');
	console.log('/*  我的第一个NODE.JS例子。BY ADMIN 2014-3-29  */');
	console.log('/*   欢迎访问我的博客：http://wallimn.iteye.com   */');
	console.log('/**************************************************/');
  	console.log('============服务启动成功，监听端口：' + app.get('port')+"============");
});
