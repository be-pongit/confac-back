const jwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken"); //for dev purposes
var json = require('./config.json');
const jwtInstance = jwt({secret: json.Client_Secret});

function* JWTErrorHandler(next){
    try {
      yield next;
    } catch (err) {
      if (401 == err.status) {
        this.status = 401;
        this.body = 'Unauthorized';
      } else {
        throw err;
      }
    }
  };


module.exports.jwt = () => jwtInstance;
module.exports.errorHandler = () => JWTErrorHandler;
module.exports.issue = (payload) => {
    return jsonwebtoken.sign(payload, SECRET);
}