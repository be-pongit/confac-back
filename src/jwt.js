const jwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken");
const SECRET = "verysecretkey"; //for dev purposes
const jwtInstance = jwt({secret: SECRET});

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