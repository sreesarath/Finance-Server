const express=require('express')
const auth=require('../Middleware/auth')
const controller=require('../Controllers/budgetController')
const router=express.Router()

router.post("/add",auth,controller.addBudget)
router.get('/get',auth,controller.getBudget)
router.delete("/delete/:id", auth, controller.deleteBudget);
router.put("/edit/:id", auth, controller.updateBudget);

module.exports=router;