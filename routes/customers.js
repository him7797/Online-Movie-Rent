const Customer = require('../models/customer'); 
const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');

//
router.get('/',[auth,admin], async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.status(200).json({
    customers
});
});



router.post('/signUp', async (req, res) => {
  try{
    let name=req.body.name;
  let password=req.body.password;
  let phone=req.body.phone;
  let email=req.body.email;
  
  let user=await  Customer.findOne({email:email});
  if(user)  res.status(400).send('User already exist');
  
  const salt=await bcrypt.genSalt(10);
  password=await bcrypt.hash(password,salt);
  const customerInfo={
    name:name,
    password:password,
    phone:phone,
    email:email,
  }
  let newCustomer=new Customer(customerInfo);
  let result=await newCustomer.save();
  res.status(200).json({
    result
});
  }
  catch(ex)
  {
    res.send(ex);
  }
  
});

router.post('/logIn',async(req,res)=>{
   
   let password=req.body.password;
   let email=req.body.email;
   let user=await  Customer.findOne({email:email});
    if(!user) return res.status(400).send('Invalid email');

    const validPassword=await bcrypt.compare(password,user.password);
    if(!validPassword) return res.status(400).send('Invalid password');
    const token=user.generateAuthToken();
    res.send(token);
});



// router.put('/:id',[auth,admin], async (req, res) => {
 

//   const customer = await Customer.updateOne({_id:req.params.id},{$set:{rental:req.body.rental}});

//   if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
//   res.send(customer);
// });

router.delete('/:id',auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id',auth, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

module.exports = router; 