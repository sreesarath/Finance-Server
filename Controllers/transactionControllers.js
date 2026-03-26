const Transaction=require('../Models/Transaction')
const Users=require('../Models/usres')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")



//add
exports.addTransaction=async(req,res)=>{
 try {
       const data=await Transaction.create({
        ...req.body,
        userId: req.user.id
       })
    res.status(201).json(data)
 } catch (err) {
    res.status(500).json(err)
 }
}

//get only logged user
exports.getTransaction=async(req,res)=>{
    try {
       const data = await Transaction
  .find({ userId: req.user.id })
  .sort({ createdAt: -1 })
    res.json(data) 
    } catch (err) {
        res.status(500).json(err)
    }
}

// delete
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Transaction ID is required" });

    // Delete transaction that belongs to logged-in user
    const deleted = await Transaction.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
//update
exports.updateTransaction=async(req,res)=>{
    try {
        const data=await Transaction.findByIdAndUpdate(
            req.params.id, //which item to be update
            req.body,      // new data
            {new:true}     //return updated data
        )
         res.json(data)
    } catch (err) {
        res.status(500).json(err)
    }
}
//signup
exports.register=async(req,res)=>{
    const {username,email,password}=req.body

    const hashedpassword=await bcrypt.hash(password,10)

const user=await Users.create({
    username,
    email,
    password:hashedpassword
})
res.json(user)
    
}
// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json("Missing email or password");
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json("User not found");
    }

    // ✅ CORRECT PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json("Wrong password");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        id: user._id
      }
    });

  } catch (err) {
    console.log("🔥 LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
};



