const { Parser}=require('json2csv')
const Transaction=require('../Models/Transaction')

exports.exportCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });

    const fields = ["amount", "category", "date", "note"];
    const parser = new Parser({ fields });

    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");

    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Export failed" });
  }
};