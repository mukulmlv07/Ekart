const Order=require("../Models/order");
const Product=require("../Models/product");
const User=require("../Models/user");
const mongoose=require('mongoose'); 
const { users_get_user } = require("./users");

exports.orders_get_all=(req,res,next)=>{
    Order.find({user:req.userData.userid})
   .select("_id product quantity user")
   .populate("product","name")
   .then(docs=>{
       if(!docs){
           return res.status(404).json({
               Message:"Not Records Found"
           })
       }
       const response=docs.map(doc=>{
           return {
               product:doc.product,
               _id:doc._id,
               quantity:doc.quantity,
               user:doc.user,
               request:{
                   message:"See Order details",
                   type:'GET',
                   url:"http://localhost:3000/orders/"+doc._id
               }        
           }
       })
       return res.status(200).json(response)
   })
   .catch(err=>{
       res.status(500).json({
           error:err
       })
   })
}

exports.orders_create_order=(req,res,next)=>{
    Product.findById({_id:req.body.productId})
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message:"Not Found"
            })
        }
        const order=new Order({
            product:req.body.productId,
            quantity:req.body.quantity,
            user:req.userData.userid
            })
        return order.save()
    })
    .then(result=>{
        User.findByIdAndUpdate({_id:req.userData.userid},{
            $addToSet:{orders:result._id}
        })
        .exec()
        // .catch(err=>{
        //     res.status(400).json({
        //         error:err
        //     })
        // })  
        res.status(201).json({
            message:"Successfully! place order",
            createdOrder:{
                product:result.product,
                quantity:result.quantity
            },
            request:{
                message:"See Placed Order",
                type:"GET",
                url:"http://localhost:3000/orders/"+result._id
            }
        })
    })
    .catch(err=>{
        return res.status(500).json({
            error:err
        })
    })
}

exports.orders_get_order=(req,res,next)=>{
    const id=req.params.orderId
    Order.findById({_id:req.params.orderId})
    .select("_id product quantity user")
    .populate("product","name price")
    .then(doc=>{
        if(!doc){
            return  res.status(404).json({
                message:"Not Found"
            })
        }
        if(doc.user==req.userData.userid){
            return res.status(200).json({
                doc,
                request:{
                    message:"Delete this product",
                    type:'DELETE',
                    url:"http://localhost:3000/orders/"+doc._id
                }
            })
        }
        else{
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}

exports.orders_delete_order=(req,res,next)=>{
    Order.findById({_id:req.params.orderId})
    .then(doc=>{
        console.log(doc)
        if(!doc){
            return res.status(404).json({
                message:"Not Found"
            })
        }
        if(doc.user==req.userData.userid){
            Order.deleteOne({_id:req.params.orderId})
            .then(result=>{
                
                return res.status(200).json({
                    message:"Successfully deleted",
                    deletedOrder:result._id,
                    request:{
                        message:"Place new Order",
                        type:"POST",
                        url:"http://localhost:3000/orders",
                        body:{
                            productId:"ObjectId",
                            quantity:"number"
                        }
                    }
                })
            })
        }
        else{
            res.status(401).json({
                message:"Unauthorized"
            })
        }   
    }) 
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    }) 
}

exports.orders_update_order=(req,res,next)=>{
    updates={};
    for (const ops of req.body){
        updates[ops.propName]=ops.value
    }
    Order.findByIdAndUpdate({_id:req.params.orderId},{$set:updates})
    .then(result=>{
        if(!result){
            return res.status(404).json({
                message:"Not Found",
            })
        }
        res.status(200).json({
            message:"Successfully Updated",
            request:{
                message:"See Updated Order",
                type:"GET",
                url:"http://localhost:3000/orders/"+result._id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
    
};



