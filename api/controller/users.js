const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../Models/user");
const Product=require("../Models/product");
exports.users_signup=(req,res,next)=>{

    User.find({email:req.body.email})
    .then(result=>{
        if(result.length>0){
            return res.status(409).json({
                message:"Email already exist"
            })
        }
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.status(500).json({
                    error:err
                })
            }
            else{
                const user=new User({
                email:req.body.email,
                password:hash
                });
                user.save()
                .then(resu=>{
                    console.log(result)
                    res.status(201).json({
                        message:"User Created Successfully"
                    })
                })
                .catch(err=>{
                    res.status(500).json({
                        error:err
                    })
                })
            }       
        })
    })
}

exports.users_login=(req,res,next)=>{
    User.find({email:req.body.email})
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                message:"Email does\'t Exist"
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:"Login Failed"
                })
            }
            if(result){
                const token=jwt.sign(
                    {
                        email:user[0].email,
                        userid:user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn:"10h"
                    }
                );
                return res.status(200).json({
                    message:"Successfully Login",
                    token:token
                })
            }
            return res.status(401).json({
                message:"Wrong Password"
            })
        })

    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })

    })
}

exports.users_get_user=(req,res,next)=>{
    console.log(req.userData.userid)
    User.findById({_id:req.userData.userid})
    .select("email orders _id ")
    .then(result=>{
        res.status(200).json({
            User:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}