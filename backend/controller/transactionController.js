const { BorrowModel } = require("../model/BorrowModel"); // ✅ correct import

exports.payFine = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("PAY FINE ID:", id);

    const record = await BorrowModel.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (record.isPaid) {
      return res.status(400).json({ message: "Fine already paid" });
    }

    if (!record.fineAmount || record.fineAmount <= 0) {
      return res.status(400).json({ message: "No fine due for this transaction" });
    }

    // ✅ update fine status
    record.isPaid = true;

    await record.save();

    res.status(200).json({
      message: "Fine paid successfully",
      data: record,
    });

  } catch (error) {
    console.error("PAY FINE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};