const express= require('express');

const router=express.Router();

const order_contoller=require("../controller/orders");

const check_auth=require("../../middleware/checkauth")

router.get("/", check_auth,order_contoller.orders_get_all);

router.post("/",check_auth, order_contoller.orders_create_order);

router.get("/:orderId",check_auth, order_contoller.orders_get_order);

router.delete("/:orderId",check_auth,order_contoller.orders_delete_order);

router.patch("/:orderId",check_auth,order_contoller.orders_update_order);

module.exports=router;