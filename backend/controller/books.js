const booksController = {};
const { BookModel } = require("../model/BookModel");
const {BorrowModel} = require("../model/BorrowModel")
const cloudinary = require("cloudinary").v2;
const calculateFine = require("../utils/fineCalculator")
const { clearCache } = require("../utils/cache");
const Membership = require("../model/membership");


booksController.addNewBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      isbn,
      availableCopies,
      totalCopies,
      coverImage,
      price,
      description,
    } = req.body;
    console.log(req.body);
    const {id} = req.userInfo;

    const existingBook = await BookModel.findOne({ isbn });
    if (existingBook) {
      return res
        .status(400)
        .json({error:true, message: "Book with this ISBN already exists" });
    }
    console.log("req.file")
    console.log(req.file)

    let coverImageUrl = req.file ? req.file.path : "";
    let cloudinaryId = req.file ? req.file.filename : "";
    console.log(coverImageUrl);

    const newBook = new BookModel({
      title,
      author,
      category,
      isbn,
      availableCopies: totalCopies,
      totalCopies,
      addedBy:id,
      coverImage:coverImageUrl,
      cloudinaryId: cloudinaryId,
      price,
      description,
    });

    await newBook.save();
    clearCache("homeData");
    res.status(201).json({error:false , message: "Book added successfully", book: newBook });
  } catch (error) {
    console.log(error);
    res.status(500).json({error:true, message: "Internal Server Error", error });
  }
};

booksController.getAllBooks = async (req, res) => {
  try {
    const books = await BookModel.find().populate("addedBy", "name email role");
    const totalBooks = books.length;
    if(!books || books.length === 0){
      return res.json({error:true,message:"No Books Found"});
    }


    res.status(200).json({error:false,message:"Books fetched Successfully",books,totalBooks});
  } catch (error) {
    res.status(500).json({error:true,  message: "Internal Server Error",
      details: error.message, });
  }
};


booksController.getIssuedRequest = async (req, res) => {
  try {
    const requestedBooks = await BorrowModel.find({ status: 'Requested' });
    const totalRequestedBooks = requestedBooks.length;
    if(!requestedBooks || requestedBooks.length === 0){
      return res.json({error:true,message:"No Books Found"});
    }


    res.status(200).json({error:false,message:"Books fetched Successfully",requestedBooks,totalRequestedBooks});
  } catch (error) {
    res.status(500).json({error:true,  message: "Internal Server Error",
      details: error.message, });
  }
};

booksController.getLatestBooks = async (req, res) => {
  try {
    const books = await BookModel.find().populate("addedBy", "name email role").sort({ createdAt: -1 }) ;
    console.log(books);
    const totalBooks = books.length;
    if(!books || books.length === 0){
      return res.json({error:true,message:"No Books Found"});
    }

    const uniqueCategories = new Set(books.map(book => book.category)); // Assuming the 'category' field in each book
    const totalCategories = uniqueCategories.size;

    const bookIds = books.map(book => book._id);

    // Fetch the issues related to these books
    const issuedBooks = await BorrowModel.find({
      bookId: { $in: bookIds },
      status: 'Issued',  // Only consider issued books
    }).populate('userId'); // Populate student details from the 'Student' collection

    // Get the unique active students from the issued books
    const activeStudents = new Set(issuedBooks.map(issue => issue.userId._id.toString()));
    const totalActiveStudents = activeStudents.size;



    res.status(200).json({error:false,message:"Books fetched Successfully",books,totalBooks,totalCategories,totalActiveStudents});
  } catch (error) {
    res.status(500).json({error:true,  message: "Internal Server Error",
      details: error.message, });
  }
};


booksController.getParticularBook = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await BookModel.findById(id).populate(
      "addedBy",
      "name email role"
    );
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

booksController.updateBook = async (req, res) => {
  try {
    const {
      title,
      author,
      category,
      isbn,
      availableCopies,
      totalCopies,
      addedBy,
      coverImage,
      price,
    } = req.body;

    const bookUpdate = await BookModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        category,
        availableCopies,
        totalCopies,
        // coverImage,
        price,
      },
      { new: true }
    );
    if (!bookUpdate) {
      return res.status(404).json({ message: "Book not found" });
    }
    clearCache("homeData");
    res
      .status(200)
      .json({ message: "Book updated successfully", book: bookUpdate });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

booksController.deleteBook = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: true, message: "Book not found" });
    if (book.cloudinaryId) {
      await cloudinary.uploader.destroy(book.cloudinaryId);
    }
    await BookModel.findByIdAndDelete(req.params.id);
    clearCache("homeData");
    res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    // console.log(deletedBook)
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

booksController.reqIssueBook = async (req, res) => {
  try {
    const userid = req.userInfo.id;
    const { bookid } = req.params;

    // 🔥 MEMBERSHIP CHECK
    const membership = await Membership.findOne({ userId: userid });

    if (!membership) {
      return res.status(400).json({
        error: true,
        message: "No membership found ❌",
      });
    }

    // Auto-expire
    if (new Date(membership.endDate) < new Date()) {
      membership.status = "expired";
      await membership.save();
    }

    if (membership.status !== "active") {
      return res.status(400).json({
        error: true,
        message: "Membership expired ❌ Please renew",
      });
    }

    // 🔥 NORMAL FLOW
    const book = await BookModel.findById(bookid);
    if (!book) {
      return res.status(404).json({
        error: true,
        message: "Book not found",
      });
    }

    if (book.availableCopies < 1) {
      return res.status(400).json({
        error: true,
        message: "No available copies to issue",
      });
    }

    const currentCount = await BorrowModel.countDocuments({
      userId: userid,
      status: { $in: ["Requested", "Issued", "Requested Return"] },
    });

    if (currentCount >= 4) {
      return res.status(400).json({
        error: true,
        message:
          "You cannot request or issue more than 4 books at a time.",
      });
    }

    const existingRequest = await BorrowModel.findOne({
      userId: userid,
      bookId: bookid,
      status: { $in: ["Requested", "Issued"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        error: true,
        message: "You already requested or issued this book",
      });
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    const newBorrow = new BorrowModel({
      bookId: bookid,
      userId: userid,
      issueDate: today,
      dueDate,
      status: "Requested",
    });

    await newBorrow.save();

    res.status(200).json({
      error: false,
      message: "Book request submitted. Wait for librarian approval.",
      borrow: newBorrow,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// booksController.getIssuedBooks = async (req, res) => {
//   try {
//     const userId = req.userInfo.id; 
//     console.log("Fetching issued books for user:", userId);

//     const issuedBooks = await BorrowModel.find({ userId, returnDate: null }) 
//       .populate("bookId", "title author category isbn price coverImage")
//       .populate("userId", "name email role"); 

//     if (!issuedBooks || issuedBooks.length === 0) {
//       return res.status(404).json({ error: true, message: "No issued books found." });
//     }

//     res.json({ error: false, message: "Issued books fetched successfully", issuedBooks });
//   } catch (error) {
//     console.error("Error fetching issued books:", error);
//     res.status(500).json({ error: true, message: "Internal server error" });
//   }
// };

booksController.getIssuedBooks = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const issuedBooks = await BorrowModel.find({
      userId,
      status: { $in: ["Issued", "Requested", "Requested Return"] }
    })
      .populate("bookId", "title author category isbn price coverImage")
      .populate("userId", "name email role")
      .sort({ issueDate: -1 });

    if (!issuedBooks || issuedBooks.length === 0) {
      return res.status(200).json({
        error: true,
        message: "No issued books found.",
        issuedBooks: []
      });
    }

    const booksWithFine = issuedBooks.map(book => {
      const fine = book.status === "Issued"
        ? 0
        : (book.fineAmount || calculateFine(book.dueDate, book.returnDate));
      return { ...book.toObject(), fine };
    });

    res.json({
      error: false,
      message: "Issued books fetched successfully",
      issuedBooks: booksWithFine
    });

  } catch (error) {
    console.error("Error fetching issued books:", error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

booksController.returnBook = async (req, res) => {
  try {
  const issueId = req.params.id;
  console.log("issueId")
  console.log(issueId)

  // Find issued book entry
  const issuedBook = await BorrowModel.findById(issueId);
  if (!issuedBook) {
      return res.status(404).json({ message: "Issued record not found" });
  }

  if (issuedBook.status === "Returned") {
      return res.status(400).json({ message: "Book already returned" });
  }

  // Update status and set return date
  issuedBook.status = "Returned";
  issuedBook.returnDate = new Date();
  await issuedBook.save();

  // Increment available copies in the Book model
  await BookModel.findByIdAndUpdate(issuedBook.bookId, {
      $inc: { availableCopies: 1 }  // Increase available copies by 1
  });

  res.json({ message: "Book returned successfully", issuedBook });
} catch (error) {
  console.error("Error returning book:", error);
  res.status(500).json({ message: "Server error" });
}
};

booksController.requestReturnBook = async (req, res) => {
  try {
    const borrowId = req.params.id;

    const borrowRecord = await BorrowModel.findById(borrowId);
    if (!borrowRecord) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    // Check if the book belongs to the logged-in user
    if (borrowRecord.userId.toString() !== req.userInfo.id.toString()) {
      return res.status(403).json({ message: "Unauthorized to request return for this book" });
    }

    // Check if status is 'Issued'
    if (borrowRecord.status !== "Issued") {
      return res.status(400).json({ message: "Only books with status 'Issued' can be requested for return" });
    }

    // Normalize due date from issue date (legacy data fix) then lock fine at request time.
    if (borrowRecord.issueDate) {
      const expectedDueDate = new Date(borrowRecord.issueDate);
      expectedDueDate.setDate(expectedDueDate.getDate() + 14);
      expectedDueDate.setHours(0, 0, 0, 0);

      const currentDueDate = new Date(borrowRecord.dueDate);
      currentDueDate.setHours(0, 0, 0, 0);

      if (currentDueDate.getTime() !== expectedDueDate.getTime()) {
        borrowRecord.dueDate = expectedDueDate;
      }
    }

    // Lock return timestamp and fine when return is requested.
    const requestedAt = new Date();
    const fineAtRequest = calculateFine(borrowRecord.dueDate, requestedAt);

    borrowRecord.status = "Requested Return";
    borrowRecord.returnDate = requestedAt;
    borrowRecord.fineAmount = fineAtRequest;
    await borrowRecord.save();

    return res.status(200).json({ message: "Return request submitted successfully" });

  } catch (error) {
    console.error("Error in return request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { booksController };

// status:"Issued"