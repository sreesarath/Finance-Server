const User=require('../Models/usres')
const Goal=require('../Models/Goal')
const Transaction=require('../Models/Transaction')

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Transaction.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete Failed" });
  }
};