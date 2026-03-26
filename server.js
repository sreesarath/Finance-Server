require("dotenv").config();
const mongoose=require('mongoose')
const express=require('express')
const cron = require("node-cron");
const cors=require('cors')

const app=express()

//middleware
app.use(cors({
  origin:"",
  credentials: true
}))
app.use(express.json())

//database connection
mongoose.connect(process.env.Mongo_string)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err))

//routes
const transactionRoutes=require('./Routes/TransactionRoutes')
const authRoutes=require('./Routes/authRoutes')
const budgetRoutes=require('./Routes/BudgetRoutes')
const goalRoutes=require('./Routes/goalRoutes')
app.use("/api/transaction",transactionRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/budget",budgetRoutes)
app.use("/api/goal",goalRoutes)


// ✅ CRON JOB HERE
cron.schedule("0 0 * * 0", async () => {
  const goals = await Goal.find({ "autoSave.frequency": "weekly" });

  for (let g of goals) {
    g.savedAmount += g.autoSave.amount;
    await g.save();
  }

  console.log("Auto savings executed 💰");
});
//server 
const PORT=5000
app.listen(PORT,()=>{
    console.log(`Server Running At http://localhost:${PORT}`);
    
})
app.get("/test", (req, res) => {
  res.send("API working")
})
