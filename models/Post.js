/**
 * Created by changetech on 16/7/5.
 */
var mongodb = require('./db.js');

function Post(title,abstract,author,post,time){
    this.title = title;
    this.abstract = abstract;
    this.author = author;
    this.post = post;
    if(time){
        this.time = time;
    }else{
        this.time = new Date();
    }
};
Post.prototype.save = function(callback){
    var post = {};
    for(var p in this){
        post[p] = this[p];
    }
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取post集合
        　　db.collection('posts',function(err,collection){
              if(err){
                  mongodb.close();
                  return callback(err);
              }
              collection.ensureIndex('author');
              collection.insert(post,{safe:true},function(err,post){
                  mongodb.close();
                  callback(err,post);
              });
          });
    });
};
Post.get = function get(author,callback){
    console.log('post');
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if(author){
                query.author = author;
            }
            collection.find(query).sort({time:-1}).toArray(function(err,docs){
                mongodb.close();
                if(err){
                    callback(err,null);
                }
                //封装posts为Post对象
                var posts = [];
                if(docs.length!=0){
                    docs.forEach(function(doc,index){
                        var post = new Post(doc.title,doc.abstract,doc.author,doc.post,doc.time);
                        posts.push(post);
                    });
                }
                callback(null,posts);
            });
        });
    });
};
module.exports = Post;


