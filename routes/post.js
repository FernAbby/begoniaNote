/**
 * Created by changetech on 16/7/5.
 */
var express = require('express');
var router = express.router();
var User = require('../models/User.js');
var Post = require('../models/Post.js');

//router.get('/post',function(req,res,next){
//    res.render('post',{title:'我的博客'});
//});
router.post('/post',function(req,res,next){
    var currentUser = {name:'wenzhen',password:'123456'};
    var post = new Post(req.body.title,req.body.abstract,currentUser.name,req.body.post,req.body.time);
    post.save(function(err){
        if(err){
            return res.json({msg:'保存失败',detail:err});
        }
        //res.json({code:0,msg:'发表成功'});
        res.redirect('/user/'+currentUser.name);
    });
});
function checkLogin(req,res,next){
    if(!req.session.user){
        return res.redirect('/login');
    }
    next();
}
function checkNotLogin(req,res,next){
    if(req.session.user){
        return res.redirect('/');
    }
}



