var express = require('express');
var querystring = require('querystring');
var router = express.Router();

var User = require('../models/user.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: '首页'});
});
router.get('/reg',function(req, res, next){
  res.render('reg',{title: '用户注册'});
});
router.post('/reg',function(req,res,next){
  req.on('data',function(data){
    var dataJson = querystring.parse(data.toString());
    var account = dataJson['account'],
        password = dataJson['password'],
        passwordRepeat = dataJson['passwordRepeat'];
    if(password != passwordRepeat){
      res.json({
        code: 1,
        msg: '两次输入密码不一致'
      });
      return;
    }
    var newUser = new User({
      account: account,
      password: password
    });
    User.get(newUser.account,function(err,user){
      if(user){
        err = {
          code: 1,
          msg: '用户名已存在'
        };
      }
      if(err){
        res.json(err);
        return;
      }
      newUser.save(function(err,user){
        if (err) {
          res.json(err);
          return;
        }
        console.log(user);
        //req.session.user = user;
        res.json({
          code: 0,
          msg: '注册成功!'
        });
        return;
      });
    });
  });
});
router.get('/login',function( req, res, next){
  res.render('login',{title: '用户登录'});
});

module.exports = router;
