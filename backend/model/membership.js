const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  membershipType: {
    type: String,
    enum: ["6 months", "1 year", "2 years"],
    default: "6 months",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  },
});

module.exports = mongoose.model("Membership", membershipSchema);