const express=require('express')
const router=express.Router()

const Controll=require('../Controllers/transactionControllers')

router.post("/signup",Controll.register)
router.post("/login",Controll.login)

module.exports=router