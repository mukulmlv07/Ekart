const express=require('express');
const router=express.Router();
const users_controller=require("../controller/users");
const check_auth=require("../../middleware/checkauth");
const user = require('../Models/user');

router.get("/",check_auth,users_controller.users_get_user);

router.post("/signup",users_controller.users_signup);

router.post("/login",users_controller.users_login);

module.exports=router;