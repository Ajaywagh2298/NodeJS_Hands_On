var express = require('express')
const __ = require("lodash/fp/__")
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

mongoose.Promise = Promise
var dbUrl = 'mongodb+srv://ajay:ajay@learning-node.3zzc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

var Message = mongoose.model('Message',{
    name : String,
    message : String
})




app.get('/Messages',(req,res) =>{

    Message.find({},(err,messages) =>{
        res.send(messages)
    })
})

/* app.post('/Messages',async (req,res) =>{
    try {
        var message = new Message(req.body)

        var savedMessage = await message.save()

        console.log('saved')

        var censored = await Message.findOne({ message: 'badword' })

        if (censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body)

        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    }
    finally {
        console.log('message post called')
    }

}) */

 app.post('/Messages',(req,res) =>{

    var message = new Message(req.body)

    message.save()
        .then(() =>{
        console.log('saved')
        return  Message.findOne({message : 'badword'})
    })
        .then(censored =>{
            if(censored) {
                console.log('censored word found', censored)
                Message.remove({_id: censored.id})
            }
            io.emit('message',req.body)
            res.sendStatus(200)
        })
        .catch((err)=>{
        res.sendStatus(500)
        return console.error(err)
    })
})

mongoose.connect(dbUrl, { useMongoClient: false }, (err) =>{
    console.log('Mongoose db connection',err)
})

io.on('connection',(socket)=>{
    console.log('a user connected')
})
var server = http.listen(8040,()=>{
    console.log('server is listening on port',server.address().port)
})
