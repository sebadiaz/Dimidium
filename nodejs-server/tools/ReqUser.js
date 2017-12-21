exports.getUserId = function(req) {
    var user="guest";
    if(req.auth && req.auth.sub){
        return  req.auth.sub;
    }
    return user;

};

exports.getUserName = function(req) {
    var user="guest";
    if(req.auth ){
            if(req.auth["unique_name"]){
                return req.auth["unique_name"];
            }
        return  req.auth.sub;
    }
    return user;

};