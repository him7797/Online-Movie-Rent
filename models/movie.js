const Joi = require('joi');
const mongoose = require('mongoose');

const Movies =   mongoose.Schema({
    ID:{
      type:String,
      required:true
    },
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    year: {
      type: String,
      required: true,
     
    },
    genre:{
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000
    },
    duration:{
        type: String,
        required: true,
    },
    country:{
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    language:{
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    director:{
        type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    writer:{
        type: String,
      required: true,
      minlength: 1,
      maxlength: 100
    },
    productionCompany:{
        type: String,
     
      minlength: 1,
      maxlength: 1000
    },
    actors:{
        type: String,
      required: true,
    },
    description:{
        type: String,
    },
    imdb:{
        type: String

    },
    totlaVotes:{
        type: String
    },
    
    rentPerDay:{
      type:Number,
      required:true
    }
  });

module.exports=mongoose.model('Movies',Movies);