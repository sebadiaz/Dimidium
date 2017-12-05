
var Queue = require('bull');
var Service = require('../kubernetes/client/ServicesService');
var redisurl=undefined;
if(process.argv.indexOf("--redis-url") != -1){ //does our flag exist?
    redisurl = process.argv[process.argv.indexOf("--redis-url") + 1]; //grab the next item
  }

var serviceQueue = new Queue("ServiceQueue");
if (redisurl){
    serviceQueue = new Queue('ServiceQueue', redisurl);
}

const processServiceObj = function(body,res){
    
}

serviceQueue.process(function(job, done){
    console.log("Job Received namespace", job.data.namespace);
    job.progress(1);
    Service.getServices(job.data.namespace,getMergedDimObj,null);
    // call done when finished
    done();
  

});
exports.manageService = function(namespace) {
    var data={namespace:namespace};
    //job now
    serviceQueue.add(data);
    //job every minute 
    serviceQueue.add(data, {repeat: {cron: '* * * * *'}});
  }

