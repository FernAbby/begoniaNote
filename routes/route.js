/**
 * Created by changetech on 16/6/16.
 */
module.exports = function (app) {
    //var books = require('./books');
    var index = require('./index');
    //app.use(books);
    app.use(index);
}