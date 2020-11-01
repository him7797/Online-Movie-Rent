const Rental = require('../models/rental'); 
const Movie = require('../models/movie'); 
const Customer = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn=require('fawn');
const express = require('express');
const router = express.Router();
const fine=100;


router.post('/rentMovie', async (req, res) => {
   
   let movie=await Movie.findById(req.body.movie);
   if(!movie) res.send().json({'message':"Given Movie ID is not available"});
   let customer=await Customer.findById(req.body.customer);
   if(!customer) res.send().json({'message':"Given Customer ID is not available"});
   
   let rentalInfo={
    customerId:req.body.customer,
    movieId:req.body.movie,
    dayIn:new Date(),
    rentPerMonth:movie.rentPerDay
   }

   let newRental=new Rental(rentalInfo);
   let result=await newRental.save();
   await Customer.updateOne({_id:req.body.customer},{$set:{rental:result._id}});
   res.send(result);
    
});


router.post('/endSub',async(req,res)=>{
  
    let rental=req.body.rental;
    let amount=0;
    let rentInfo=await Rental.findById(rental);
    if(!rentInfo) res.send().json({'message':"Rent with given ID not Found"});
    if(rentInfo.endSub==true) res.send().json({'message':"Rental ended and paid"});

    const date2 = new Date();
    const date1=rentInfo.dayIn;
    const diffTime = Math.abs(date2 - date1);
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   console.log(diffDays);
   if(diffDays>30)
   {
       amount=rentInfo.rentPerMonth+(diffDays-30)*fine;
   }
   else{
     amount=rentInfo.rentPerMonth;
   } 
   await Rental.updateOne({_id:rental},{$set:{amountPaid:amount,endSub:true}});
   res.send(rental);

});

// router.get('/:id', async (req, res) => {
//   const rental = await Rental.findById(req.params.id);

//   if (!rental) return res.status(404).send('The rental with the given ID was not found.');

//   res.send(rental);
// });

module.exports = router; 