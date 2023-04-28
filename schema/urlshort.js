const mongoose = require('mongoose')
// const shortid = require('shortid');

const URLSchema = new mongoose.Schema({
    longUrl : {
        type:String,
        required:true
    },
    shortUrl:{
        type:String,
        unique: true,
        // default: shortid.generate
    },
    click:{
        type:Number,
        default:0
    },
    createdAt:{type:String, default:new Date()}
},
    {timestamps : true}
)

const urlModel = mongoose.model('urlshort', URLSchema)

module.exports= {urlModel}