const mongoose=require("mongoose")
const Goal = require('../Models/Goal')
const calculateGoalAI=require('../Utils/goalAI')
const Transaction=require('../Models/Transaction')

// create a goal
exports.addGoal = async (req, res) => {
    try {
        const { title, targetAmount } = req.body;
        const goal = await Goal.create({
            userId: req.user.id,
            title,
            targetAmount
        });
        res.status(201).json(goal)
    } catch (err) {
         res.status(500).json(err)
    }
}
// get goal
exports.getGoal = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });

        res.json(goals || []); // ✅ always return array
        console.log("USER:", req.user);
    } catch (err) {
        console.error(err); // 🔥 IMPORTANT
        res.status(500).json({ message: "Server error" });
    }
};
// add money to the goals

exports.addMoneyGoal=async(req,res)=>{
try {
    const {amount}=req.body
    const goal=await Goal.findById(req.params.id)
    if (!goal) return res.status(404).json({message:"Goal not found"})
        goal.savedAmount +=amount;
    await goal.save()
    res.json(goal)
} catch (err) {
        res.status(500).json(err);
}
}
// delete
exports.deleteGoal = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("DELETE ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ Invalid ObjectId");
      return res.status(400).json("Invalid ID");
    }

    const deleted = await Goal.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json("Goal not found");
    }

    res.status(200).json("Deleted successfully");
  } catch (err) {
    console.log("❌ DELETE ERROR:", err);
    res.status(500).json(err);
  }
};
exports.getGoalSuggestion = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    const remaining = goal.targetAmount - goal.savedAmount;

    const daysLeft =
      (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24);

    const weekly = Math.ceil((remaining / daysLeft) * 7);

    res.json({
      weeklySaving: weekly,
      message: `Save $${weekly}/week to reach your goal`
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.getGoalInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ userId });
    const goals = await Goal.find({ userId });

    let income = 0;
    let expense = 0;

    transactions.forEach(val => {
      if (val.amount > 0) income += val.amount;
      else expense += Math.abs(val.amount);
    });

    const totalMonthlySavings = income - expense;

    if (totalMonthlySavings <= 0) {
      return res.json({ status: "No Capacity" });
    }

    const totalTargetCombined = goals.reduce(
      (sum, g) => sum + g.targetAmount,
      0
    );

    const currentGoalAmount = Number(req.body.goalAmount) || 0;
    const currentSaved = Number(req.body.currentSaved) || 0;

    const goalWeight =
      totalTargetCombined > 0
        ? currentGoalAmount / totalTargetCombined
        : 1;

    const allocatedSavings = totalMonthlySavings * goalWeight;

    const aiData = calculateGoalAI({
      income: allocatedSavings,
      expense: 0,
      goalAmount: currentGoalAmount,
      currentSaved: currentSaved
    });

    res.json(aiData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI calculation failed" });
  }
};