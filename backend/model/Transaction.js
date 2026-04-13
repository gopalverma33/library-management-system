const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },

  issueDate: Date,
  dueDate: Date,
  returnDate: Date,

  fineAmount: { type: Number, default: 0 },

  isPaid: { type: Boolean, default: false },
  paymentDate: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);