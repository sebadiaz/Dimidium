var Config = require('./Config');
exports.getUserId = function(req) {
    var user="guest";
    if(req && req.sub){
        return  req.sub;
    }
    return user;

};

exports.getUserName = function(req) {
    var user="guest";
    if(req ){
            if(req[Config.getJWTUserName()]){
                return req[Config.getJWTUserName()];
            }
        return  req.sub;
    }
    return user;

};