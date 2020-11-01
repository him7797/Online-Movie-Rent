const express=require('express');
const error=require('../middleware/error');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const user=require('../routes/users');
const auth=require('../routes/auth');
// const customReview=require('../routes/customReview');

module.exports=function(app){
    app.use(express.json());
    app.use('/api/users',user);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/auth',auth);
    
    // app.use('/api/customerReviews',customReview);
    app.use(error);
}