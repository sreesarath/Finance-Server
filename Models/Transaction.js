const mongoose=require('mongoose')

const transactionSchema=new mongoose.Schema({
    text:String,
    amount:Number,
    type:String,//income //expence
    category:String,
    date:{type:Date,default:Date.now},
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
}) 


module.exports=mongoose.model("transaction",transactionSchema)
