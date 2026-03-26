const express=require('express')
const controll=require('../Controllers/transactionControllers')
const auth=require('../Middleware/auth')
const { exportCSV } = require('../Controllers/exportCSV')
const { deleteAccount } = require('../Delete/deleteAccount')
const router=express.Router()

router.post("/add",auth,controll.addTransaction)
router.get("/get",auth,controll.getTransaction)
router.delete("/delete/:id",auth,controll.deleteTransaction)
router.put("/edit/:id",auth,controll.updateTransaction)
router.get('/export/csv',auth,exportCSV)
router.delete('/account/delete',auth,deleteAccount)


module.exports=router;