var Config = require('../tools/Config');
var Helm = require('../kubernetes/helm/HelmService');
var Db = require('mongodb').Db,Mongodb = require('mongodb'),
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,
assert = require('assert');

const findDocuments = function(db, type,client,callback) {
    // Get the documents collection
    const collection = db.collection(type);
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      callback(err,docs);
      client.close();
    });
  };

const insertDocuments = function(db, type,document,callback) {
    // Get the documents collection
    const collection = db.collection(type);
    // Insert some documents
    collection.insert(document, function(err, result) {
      callback(err,result);
    });
  }
;

  const insertStream = function(db, name,stream,client,callback) {
    var bucket = new Mongodb.GridFSBucket(db);
    stream.pipe(bucket.openUploadStream(name)).
        on('error', function(error) {
            callback(error,null);
        }).
        on('finish', function() {
            callback(null,'done');
            client.close();
        });

  };

  exports.listDocuments = function(type,callback) {
    // Connection URL
    const url = Config.getMongoDbUrl();

    // Database Name
    const dbName = Config.getMongoDbName();


    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      if (err){
        callback(err,r);
        console.log('url:'+url+" "+JSON.stringify(err));
        return;
      }
    
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    findDocuments(db,type,client,callback);

  });
    
    
  };

exports.pushDocument = function(type,document,callback) {
    
    // Connection URL
    const url = Config.getMongoDbUrl();

    // Database Name
    const dbName = Config.getMongoDbName();


    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      if (err){
        callback(err,r);
        console.log('url:'+url+" "+JSON.stringify(err));
        return;
      }
    
    console.log("Connected successfully to server");
    if (Config.isDebug()){
      console.log('doc:'+JSON.stringify(document));
    }
    const db = client.db(dbName);
    insertDocuments(db,type,document,callback);
    client.close();
  });
    
    
  };

  exports.deleteDocument = function(type,doc,callback) {
    
    // Connection URL
    const url = Config.getMongoDbUrl();

    // Database Name
    const dbName = Config.getMongoDbName();


    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      if (err){
        callback(err,r);
        console.log('url:'+url+" "+JSON.stringify(err));
        return;
      }
    
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    var col = db.collection(type);
    col.deleteOne(doc, function(err, r) {
        callback(err,r);
        client.close();
    }) ;
    
    
  });
}

  exports.pushStream = function(name,stream,callback) {
    
    // Connection URL
    const url = Config.getMongoDbUrl();

    // Database Name
    const dbName = Config.getMongoDbName();


    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      if (err){
        callback(err,r);
        console.log('url:'+url+" "+JSON.stringify(err));
        return;
      }
    
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    
    insertStream(db,name,stream,client,callback);
    
  });
    
    
  };

  exports.downloadStream = function(name,callback) {
    
    // Connection URL
    const url = Config.getMongoDbUrl();

    // Database Name
    const dbName = Config.getMongoDbName();


    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
      if (err){
        callback(err,r);
        console.log('url:'+url+" "+JSON.stringify(err));
        return;
      }
    
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
    var bucket = new Mongodb.GridFSBucket(db);
    var downloadStream = bucket.openDownloadStreamByName(name);
    downloadStream.on('data', function(data) {
        callback(data);
      });
  
      downloadStream.on('end', function() {
        client.close();
      });
  });
    
    
  };

