const mongoose = require('mongoose');

const customerReview = mongoose.Schema({
    movieId: {
        type: String,
        ref: 'IMDB_MOVIES',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    review: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        required: true
    },
   
    active: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('customerReview', customerReview);