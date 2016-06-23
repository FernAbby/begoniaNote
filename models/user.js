var mongodb = require('./db.js');
function User(user){
    this.name = user.name;
    this.password = user.password;
}
module.exports = User;

//新增用户
User.prototype.save = function save(callback){
    //用户对象
    var user = {
        name: this.name,
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
            //为name属性添加索引
            collection.ensureIndex('name',{unique:true});
            //写入
        })
    });
};