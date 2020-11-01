const mongoose = require('mongoose');
const Rental = mongoose.Schema({
  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  movieId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  dayIn:{
    type:Date,
    required:true
  },
  dayOut:{
    type:Date
  },
  endSub:{
    type:Boolean,
    default:false
  },
  amountPaid:{
    type:Number
  },
  rentPerMonth:{
    type:Number
  }
  
});

module.exports=mongoose.model('Rental',Rental);
