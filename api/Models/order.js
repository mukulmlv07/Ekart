const mongoose=require("mongoose");
const Product=require("../Models/product");
const User=require("../Models/user");
const orderSchema=mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId, ref:'Product',required:true},
    quantity:{type:Number,default:1},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'}   
}) 
module.exports=mongoose.model("Order",orderSchema);