const config=require('config');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const _ =require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth=require('../middleware/auth');
const admin=require('../middleware/admin');

// router.get('/me',auth,async(req,res)=>{
//   const user=await User.findById(req.user._id).select('-password');
//   res.send(user);
// });
router.post('/login',async(req,res)=>{
    
    let user=await  User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Invalid email');

    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');
    const token=user.generateAuthToken();
    res.send(token);
});
router.get('/',async(req,res)=>{
    try{
        let getuser=await User.find();
    res.status(200).json({
        getuser
    });
    }
    catch(e){
        res.status(404).json({
            e
        })
    }
    
});

router.post('/signUp', async (req, res) => {
    
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);
        
        let user=await  User.findOne({email:req.body.email});
        if(user) return res.status(400).send('User already exist');
    
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
    
        await user.save(); 
        const token=user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
        
        
    }
    catch(e){
        res.status(404).json({
            e
        });
    }
    

    //res.header('x-auth-token',token).send(_.pick(user,['name','email']));
});

//use joi-password-complexity
module.exports = router;




// const {Genre, validate} = require('../models/genre');
// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();
// const auth=require('../middleware/auth');
// const admin=require('../middleware/admin');
// const asyncMiddleware=require('../middleware/async');

// router.get('/', asyncMiddleware(async(req, res) => {
//     const genres = await Genre.find().sort('name');
//     res.send(genres);
   
// })); 

// router.post('/', auth,asyncMiddleware(async (req, res) => {
  

//   const { error } = validate(req.body); 
//   if (error) return res.status(400).send(error.details[0].message);

//   let genre = new Genre({ name: req.body.name });
//   genre = await genre.save();                                        
  
//   res.send(genre);
// }));

// router.put('/:id', asyncMiddleware(async (req, res) => {
//   const { error } = validate(req.body); 
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
//     new: true
//   });

//   if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
//   res.send(genre);
// }));

// router.delete('/:id', [auth,admin],asyncMiddleware(async (req, res) => {
//   const genre = await Genre.findByIdAndRemove(req.params.id);

//   if (!genre) return res.status(404).send('The genre with the given ID was not found.');

//   res.send(genre);
// }));

// router.get('/:id',asyncMiddleware( async (req, res) => {
//   const genre = await Genre.findById(req.params.id);

//   if (!genre) return res.status(404).send('The genre with the given ID was not found.');

//   res.send(genre);
// }));

// module.exports = router;