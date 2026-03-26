const Budget = require('../Models/Budget')
const Transaction = require('../Models/Transaction');

// add budget
exports.addBudget = async (req, res) => {
    try {
        const { category, limit, month } = req.body;
        const existing = await Budget.findOne(
            {
                userId: req.user.id,
                category,
                month
            }
        );
        //prevent duplicate budget for same month
        if (existing) {
            return res.status(400).json({ message: "Budget already exists" });
        }
        const data = await Budget.create({
            userId: req.user.id,
            category,
            limit,
            month
        });
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};
// get budget
exports.getBudget = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });

    const transactions = await Transaction.find({ userId: req.user.id });

    const updatedBudgets = budgets.map((b) => {
      const spent = transactions
        .filter(
          (t) =>
            t.category === b.category &&
            t.amount < 0 // only expenses
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        ...b._doc,
        spent
      };
    });

    res.json(updatedBudgets);
  } catch (err) {
    res.status(500).json(err);
  }
};
// DELETE budget
exports.deleteBudget = async (req, res) => {
  try {
    const data = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    console.log("Deleting ID:", req.params.id);
     console.log("User:", req.user.id);

    if (!data) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE budget
exports.updateBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      { category, limit },
      { new: true }
    );
    console.log("UPDATE HIT:", req.body);

    if (!data) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(data);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json(err);
  }
};
// console.log("Deleting ID:", req.params.id);
// console.log("User:", req.user.id);