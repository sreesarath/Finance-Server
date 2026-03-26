const express = require("express");
const router = express.Router();
const auth = require("../Middleware/auth");
const ctrl = require("../Controllers/goalController");

router.post("/add", auth, ctrl.addGoal);
router.get("/get", auth, ctrl.getGoal);
router.put("/add-money/:id", auth, ctrl.addMoneyGoal);
router.delete("/delete/:id", auth, ctrl.deleteGoal);
router.post("/insights",auth,ctrl.getGoalInsights)

module.exports = router;