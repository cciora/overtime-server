var express = require('express')
var Schema = require('./schema')
var graphQLHTTP = require('express-graphql')

var app = express()
app.use('/', graphQLHTTP((req,res)=>{
  res.set('Access-Control-Allow-Origin', '*');
  return {
    schema: Schema,
    pretty: true,
    graphiql: true
  }
}));

module.exports = app;