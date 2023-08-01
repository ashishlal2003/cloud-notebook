const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 5000;
const mongoURI="mongodb+srv://admin:admin@taskcrud.qfc1vgl.mongodb.net/"

app.use(express.json());
// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>{
        //listen for requests
        app.listen(port, ()=>{
            console.log("connected to db & listening on port 5000");
        })
    })
    .catch((err)=>{
        console.log(err);
    })

