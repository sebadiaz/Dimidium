
var Service = require('../kubernetes/client/ServicesService');

var kue = require('kue')
var queue= {};
if(process.argv.indexOf("--annotation-dns") != -1){
    iol , queue = kue.createQueue();
    queue.process('service', processLoop);
}


const processLoop = function(job, done){
    console.log("Job Received namespace");
    Service.getServices(job.data.namespace,processServiceObj,job.data);
    // call done when finished
    done();
}




const processServiceObj = function(body,res){
    var str = JSON.stringify(body);
    console.log("Job Received namespace", str);
    var items = body['items'];


    var arrayLength = items.length;
    for (var i = 0; i < arrayLength; i++) {
          var name=items[i]['metadata']['name'];
          var namespace=items[i]['metadata']['namespace'];
          var labels=items[i]['metadata']['labels'];
          var annotations=items[i]['metadata']['annotations'];
          var base_dns=annotations['external-dns.dimidium/name'];
          console.log("Found dns on ", name);
          if(base_dns){
            console.log("Found dns on ", name);
            Service.patchAnnotation(namespace,name,"external-dns.alpha.kubernetes.io/hostname",base_dns+"-"+res.appUrl);
          }
    }
}



var minute = 60000;
var second = 1000;
exports.manageService = function(namespace,appUrl) {
    console.log("Add service queue", namespace);
    var data={namespace:namespace,appUrl:appUrl};


      

    //job now
    console.log("Add service queue", data);
    queue.create( 'service', data ).delay( second * 20 )
    .priority( 'high' )
    .save();

    //job every minute 
    console.log("Add service queue repeat", data);
//    serviceQueue.add(data, {repeat: {cron: '* * * * *'}});
    console.log("End", data);
  }




