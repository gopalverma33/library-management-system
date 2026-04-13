const { BorrowModel } = require("../model/BorrowModel");
const { BookModel } = require("../model/BookModel");
const calculateFine = require("../utils/fineCalculator");
const { clearCache } = require("../utils/cache");

const librarianController = {};

// 📚 Issued Books
librarianController.bookIssued = async (req, res) => {
  try {
    const requests = await BorrowModel.find({ status: "Issued" })
      .populate("userId", "name email")
      .populate("bookId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Issued books fetched successfully",
      requests,
    });
  } catch (err) {
    console.error("Error fetching issued books", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📥 Issue Requests
librarianController.issueRequest = async (req, res) => {
  try {
    const requests = await BorrowModel.find({ status: "Requested" })
      .populate("userId", "name email")
      .populate("bookId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Requested books fetched successfully",
      requests,
    });
  } catch (err) {
    console.error("Error fetching requests", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Approve Issue Request
librarianController.approveRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const borrowRequest = await BorrowModel.findById(requestId);
    if (!borrowRequest) {
      return res.status(404).json({ error: "Borrow request not found" });
    }

    // Max 4 books rule
    const issuedCount = await BorrowModel.countDocuments({
      userId: borrowRequest.userId,
      status: "Issued",
    });

    if (issuedCount >= 4) {
      return res.status(400).json({
        error: "User already has 4 issued books",
      });
    }

    const book = await BookModel.findById(borrowRequest.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        error: "No copies available",
      });
    }

    // 🔥 FIX: Ensure required fields exist
    if (!book.totalCopies) book.totalCopies = book.availableCopies || 1;
    if (!book.cloudinaryId) book.cloudinaryId = "default_id";
    if (!book.addedBy) book.addedBy = req.userInfo.id;

    // Reduce available copies
    book.availableCopies -= 1;
    await book.save();

    // Update borrow request
    const issuedAt = new Date();
    const dueAt = new Date(issuedAt);
    dueAt.setDate(dueAt.getDate() + 14);

    borrowRequest.status = "Issued";
    borrowRequest.issueDate = issuedAt;
    borrowRequest.dueDate = dueAt;
    borrowRequest.approvedBy = req.userInfo.id;
    await borrowRequest.save();

    clearCache("homeData");

    res.json({
      message: "Book issued successfully",
      borrow: borrowRequest,
    });
  } catch (err) {
    console.error("Error approving request", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📤 Return Requests
librarianController.returnRequest = async (req, res) => {
  try {
    const requests = await BorrowModel.find({
      status: "Requested Return",
    })
      .populate("userId", "name email")
      .populate("bookId", "title")
      .sort({ createdAt: -1 });

    const requestsWithFine = requests.map((reqItem) => {
      const fine = calculateFine(reqItem.dueDate, reqItem.returnDate);
      return { ...reqItem.toObject(), fine };
    });

    res.status(200).json({
      message: "Return requests fetched successfully",
      requests: requestsWithFine,
    });
  } catch (err) {
    console.error("Error fetching return requests", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Approve Return Request
librarianController.approveReturnRequest = async (req, res) => {
  try {
    const borrowId = req.params.id;

    const borrow = await BorrowModel.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({
        message: "Borrow record not found",
      });
    }

    if (borrow.status !== "Requested Return") {
      return res.status(400).json({
        message: "Invalid return request",
      });
    }

    const book = await BookModel.findById(borrow.bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // 🔥 FIX: Ensure required fields exist
    if (!book.totalCopies) book.totalCopies = book.availableCopies || 1;
    if (!book.cloudinaryId) book.cloudinaryId = "default_id";
    if (!book.addedBy) book.addedBy = req.userInfo.id;

    // Increase available copies
    if (book.availableCopies < book.totalCopies) {
      book.availableCopies += 1;
    }

    await book.save();

    // Update borrow record and calculate final fine at return time.
    const actualReturnDate = borrow.returnDate || new Date();
    const calculatedFine = calculateFine(borrow.dueDate, actualReturnDate);

    borrow.status = "Returned";
    borrow.returnDate = actualReturnDate;
    borrow.fineAmount = calculatedFine;
    borrow.approvedBy = req.userInfo.id;

    await borrow.save();

    clearCache("homeData");

    res.status(200).json({
      message: "Book return approved successfully",
    });
  } catch (error) {
    console.error("Error approving return request:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { librarianController };