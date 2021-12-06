var fs = require('fs')
var data = require('./data.json')

fs.readFile('./data.json','utf-8',(err,data) => {
    var data = JSON.parse(data)
    console.log(data.name);
})