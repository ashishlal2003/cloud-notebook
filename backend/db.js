const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017"


const connectToMongo =  () => {
    try {
        mongoose.connect(mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(()=>{
                
                    console.log("connected to db & listening on port");
            
            })
            .catch((err)=>{
                console.log(err);
            })
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

module.exports = connectToMongo;

