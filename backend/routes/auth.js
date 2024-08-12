import express from "express";
const router = new express.Router();
import User from '../models/User.js';
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

router.post("/register",async (req,res)=>{
    const newUser=new User({
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password,process.env.Secret_Passphrase),
    })
    try{
        const savedUser=await newUser.save();
        res.status(201).json(savedUser)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.post("/login",async(req,res)=>{
    try{
        const user=await User.findOne({username:req.body.username});
        !user && res.status(401).json("Wrong Credentials");
        const hashpassword=CryptoJS.AES.decrypt(user.password,process.env.Secret_Passphrase);
        const loginpass=hashpassword.toString(CryptoJS.enc.Utf8);
        loginpass !== req.body.password&&res.status(401).json("Wrong Credentials");
        const accessToken=jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.JWT_SEC,{expiresIn:"3d"})
        const {password,...others}=user._doc;
        res.status(200).json({...others,accessToken});
    }
    catch(err){
        res.status(500).json(err)
    }
})



export default router;