var  mongodb = require('./db');
function  User(user) {
    this.account = user.account;
    this.password = user.password;
}
module.exports = User;

//新增用户
User.prototype.save = function  save(callback) {
    // 用户对象
    var  user = {
        account: this.account,
        password: this.password
    };
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为account属性添加索引
            collection.ensureIndex('account',{unique:true});
            //写入user文档
            collection.insert(user,{safe:true},function(err){
                mongodb.close();
                callback(err,user);
            });
        });
    });
};
//获取用户
User.get = function get(account, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        // 读取 users 集合
        db.collection('users', function(err, collection) {
            if (err) {
                throw err;
                mongodb.close();
                return callback(err);
            }else{
                console.log('打开成功');
            }
            // 查找 account 属性为 account 的文档
            collection.findOne({account: account}, function(err, doc) {
                if(err){
                    throw err;
                }else{
                    console.log('成功');
                }
                mongodb.close();
                if (doc) {
                    // 封装文档为 User 对象
                    var user = new User(doc);
                    callback(err, user);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

















