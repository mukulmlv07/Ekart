const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
        match:/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
    },
    password:{type:String,required:true},
    orders:[]
})

module.exports=mongoose.model('User',userSchema);