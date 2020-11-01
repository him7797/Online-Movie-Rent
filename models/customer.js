
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const config=require('config');
 

const Customer = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  password: {
    type: String,
    default: false
  },
  phone: {
    type: String,
    required: true,
    unique:true,
    minlength: 10,
    maxlength: 10
  },
  email:{
    type:String,
    required:true
  },
  rental:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Rental'
  }
});
Customer.methods.generateAuthToken=function(){
  const token=jwt.sign({_id:this._id},config.get('jwtPrivateKey'));
  return token;
}


module.exports = mongoose.model('Customer', Customer);
