const {Schema, model} = require('mongoose')

const schema = new Schema({
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    radiation: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now 
    }
})

module.exports = model('RadCoord', schema)