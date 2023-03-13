const express=require("express");

const router=express.Router();
var count=1;
const multer=require('multer')

const product_controller=require("../controller/products");

const check_auth=require("../../middleware/checkauth")

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads")
    },
    filename:function(req,file,cb){
        console.log()
        cb(null, String(count)+req.userData.email+"-"+file.originalname);
        count=count+1;
    }
})

const filter=function(req,file,cb){
    if(file.mimetype=='image/jpeg'  || file.mimetype=='image/png'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}

const upload=multer({
    storage:storage,
    fileFilter:filter,
    limits:{filesize:1024*1024*5}
})

router.get("/",product_controller.products_get_all);

router.post("/",check_auth,upload.single('productImage'),product_controller.products_create_product);

router.get("/:productId",product_controller.products_get_product);

router.delete("/:productId",check_auth,product_controller.products_delete_product);

router.patch("/:productId",check_auth,product_controller.products_update_product);


module.exports=router;