const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require("../middleware/requireLogin")
router.get('/',(req,res)=>{
    res.send("hello")
})


router.post('/signup', (req,res)=>{
     const{name ,email,password} = req.body
     if (!email || !password || !name){
        return res.status(422).json({error:"please add all the fields"})
     }
     User.findOne({name:name})
     .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists"})     
        }
        bcrypt.hash(password,12)
        .then(hashedpassword =>{ const user = new User({
            name ,email , password:hashedpassword 
        })

        user.save().then(user=>{
            res.json({message: "saved successfully"})
        })
        .catch(err=>{
            console.log(err)
        })})
       
     }).catch(err=>{
        console.log(err)})
})

router.post('/signin', (req,res)=>{
    const{email,password} = req.body 
    if (!email||!password){
        res.status(401).json({error:"please enter both the fields"})
    }
    User.findOne({email:email}).
    then(savedUser=>{
        if (!savedUser){
           return res.status(422).json({error:"INvalid email " })
        }
        bcrypt.compare(password,savedUser.password).then(doMatch =>{
        if(doMatch){
            const token = jwt.sign({_id :savedUser._id}, JWT_SECRET)
            const{_id , name , email ,followers,following} = savedUser 
            res.json({token , user : {_id , name , email , followers , following}})
        }
        else{
            return res.status(422).json({error:"INvalid password" })
        }}).catch(err=>{
            console.log(err)
        })
        })
    })

module.exports = router        