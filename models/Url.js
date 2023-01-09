const mongoose = require('mongoose')

// instantiate a mongoose schema
const URLSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    ip: String,
    date: {
        type: Number,
        default: 0
    }
})



// create a model from schema and export it
module.exports = mongoose.model('urls', URLSchema)