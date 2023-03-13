const mongoose=require("mongoose")
const productSchema=mongoose.Schema({
    //_id: {type:mongoose.Schema.Types.ObjectId},
    name :{type:String},
    price :{type:Number},
    productImage:{type:String}
})

module.exports=mongoose.model("Product",productSchema);