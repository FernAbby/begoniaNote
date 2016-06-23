var setting = {
    cookieSecret: 'wenzhen',//cookie加密
    db: 'begoniaNote',//数据库名称
    host: 'localhost'//数据库地址
};
var db = require('mongodb').Db;
var server = require('mongodb').Server;
module.exports = new db(setting.db,new server(setting.host,27017,{}));