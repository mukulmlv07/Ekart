const mongoose=require("mongoose");
const Product=require("../Models/product");

exports.products_get_all=(req,res,next)=>{
    Product.find()
    .select("_id name price productImage")
    .then(docs=>{
        //console.log(docs)
        if(docs){          
            const response={
                count:docs.length,
                products:docs.map(doc=>{
                    return {
                        _id:doc._id,
                        name:doc.name,
                        price:doc.price, 
                        productImage:doc.productImage,   
                        request:{
                            type:'GET',
                            url: "http://localhost:3000/products/" + doc._id
                        }
                        // request:{
                        //     type:'DELETE',
                        //     url: "http://localhost:3000/products/" + doc._id
                        // }
                      }
                    })
            }
            res.status(200).json({response})
        }
        else{
            res.status(404).json({
                Error:"NO entries Found"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })

}

exports.products_create_product=(req,res,next)=>{
    const product=new Product({
        //_id:mongoose.Types.ObjectId,
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
    product.save()
    .then(result=>{
        console.log(result)
        res.status(201).json({
            message:"Succesfully Added",
            CretedProduct:{
                name:result.name,
                price:result.price,
                _id:result.id,
                productImage:result.productImage
            },
            request:{
                type:'GET',
                message:"See All Products",
                url:"http://localhost:3000/products"
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            message:"Succesfully Added",
            Product:err
        })
    })
}

exports.products_get_product=(req,res,next)=>{
    const id=req.params.productId
    Product.findById(id)
    .select("_id name price productImage")
    .then(result=>{
        res.status(200).json({
            Product:result,
            request:{
                message:"See all Products",
                request:{
                    type:'GET',
                    url:"http://localhost:3000/products"
                }

            }
        })
    })
    .catch(errr=>{
        res.status(404).json({
            message:"No Product Found",
            Product:err
        })
    })
}

exports.products_delete_product=(req,res,next)=>{ 
    const id=req.params.productId
    Product.findByIdAndDelete({_id:id})
    .then(result=>{
        if(result){
            res.status(200).json({
                message:"Successfully deleted",
                deletedProduct:result.name,
                request:{
                    type:'POST',
                    url:"http://localhost:3000/products",
                    body:{
                        name:'string',
                        price:'number'
                    }
                }
            })
        }
        else{
            res.status(404).json({
                message:"Not Found"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
 
}

exports.products_update_product=(req,res,next)=>{
    const id=req.params.productId
    updateOps={}
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value
    }
    Product.findByIdAndUpdate({_id:id},{$set:updateOps})
    .exec()
    .then(result=>{
        if(result){
            res.status(200).json({
                messege:"SuccessFully Updated",
                request:{
                    message:"See Updated Product",
                    type:'GET',
                    url:"http://localhost:3000/products/" +result._id 
                }
            })
        }
        else{
            res.status(404).json({
                messege:"Not Found"
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })

    })
   
}