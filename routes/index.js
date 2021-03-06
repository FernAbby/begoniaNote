var express = require('express');
var querystring = require('querystring');
var router = express.Router();

var User = require('../models/User.js');
var Post = require('../models/Post.js');
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('hehhhe');
    Post.get(null,function(err,posts){
        if(err){
            posts = [];
        }
        console.log(posts);
        res.render('home', {
            title: '首页',
            posts: posts
        });
    });
});
router.get('/reg', function (req, res, next) {
    res.render('reg', {title: '用户注册'});
});
router.post('/reg', function (req, res, next) {
    var account = req.body['account'],
        password = req.body['password'],
        passwordRepeat = req.body['passwordRepeat'];
    if (password != passwordRepeat) {
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
    User.get(newUser.account, function (err, user) {
        if (user) {
            err = {
                code: 1,
                msg: '用户名已存在'
            };
        }
        if (err) {
            return res.json(err);
        }
        newUser.save(function (err, user) {
            if (err) {
                res.json(err);
                return;
            }
            req.session.user = user;
            return res.json({
                code: 0,
                msg: '注册成功!',
                url: '/'
            });
        });
    });
});
router.get('/login', function (req, res, next) {
    console.log(req.body);
    res.render('login', {title: '用户登录'});
});
router.post('/login',function(req, res, next){
    User.get(req.body.account,function(err,user){
        if(!user){
            res.json({code:1,msg:'用户名不存在'});
            return;
        }
        if(user.password != req.body.password){
            res.json({code:1,msg:'密码错误'});
            return;
        }
        req.session.user = user;
        res.json({code:1,msg:'登录成功',url: '/'});
        return;
    });
});

module.exports = router;
