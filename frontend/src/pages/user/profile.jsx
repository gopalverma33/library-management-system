import { useEffect, useState } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import "./profile.css";
import { getAuthToken } from "../../utils/auth";
import { showErrorToast, showSuccessToast } from "../../utils/toasthelper";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [issuedRequests, setIssuedRequests] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);

  // 📥 Fetch Issued Books
  const fetchIssuedBooks = async () => {
    try {
      const response = await axios.get(`${Server_URL}books/issued`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });

      const books = response.data.issuedBooks || [];

      // ✅ REMOVE DUPLICATES
      const uniqueBooks = Array.from(
        new Map(books.map((item) => [item._id, item])).values()
      );

      setIssuedBooks(
        uniqueBooks.filter((b) => ["Issued", "Requested Return"].includes(b.status))
      );
      setIssuedRequests(uniqueBooks.filter((b) => b.status === "Requested"));
      setReturnRequests(uniqueBooks.filter((b) => b.status === "Requested Return"));

    } catch (error) {
      console.error("Error fetching issued books:", error.message);
    }
  };

  // 👤 Fetch Profile
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${Server_URL}users/profile`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      setUser(response.data.user || {});
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchIssuedBooks();
  }, []);

  // 🔄 Return Book
  const returnBook = async (transactionId) => {
    try {
      const response = await axios.put(
        `${Server_URL}books/returnrequest/${transactionId}`,
        {},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );

      showSuccessToast(response.data.message);
      fetchIssuedBooks();
    } catch (error) {
      console.error("Error returning book:", error);
      showErrorToast(error.response?.data?.message || "Something went wrong!");
    }
  };

  // 💰 Pay Fine
  const payFine = async (transactionId) => {
    if (!transactionId) return;

    try {
      await axios.put(
        `${Server_URL}transactions/pay-fine/${transactionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );

      showSuccessToast("Fine paid successfully ✅");
      fetchIssuedBooks();

    } catch (error) {
      console.error("Error paying fine:", error);
      showErrorToast(error.response?.data?.message || "Payment failed!");
    }
  };

  if (!user) return <p className="loading">Loading...</p>;

  const renderBookTitle = (transaction) =>
    transaction?.bookId?.title || "Untitled";

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* 👤 Profile */}
        <div className="profile-info card">
          <h1>{user.name}</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="profile-sections">

          {/* 📚 Issued Books */}
          <div className="section-card issued-books">
            <h2>📚 Issued Books</h2>

            {issuedBooks.length === 0 ? (
              <p>No books currently issued.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Fine</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {issuedBooks.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{renderBookTitle(transaction)}</td>

                      <td>
                        {new Date(transaction.issueDate).toLocaleDateString()}
                      </td>

                      <td>
                        {new Date(transaction.dueDate).toLocaleDateString()}
                      </td>

                      <td>
                        <span className="badge issued">{transaction.status}</span>
                      </td>

                      {/* 💰 Fine */}
                      <td>
                        {transaction.fine > 0 ? (
                          transaction.isPaid ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>
                              Paid ₹{transaction.fine}
                            </span>
                          ) : (
                            <div>
                              <span style={{ color: "red" }}>
                                ₹{transaction.fine}
                              </span>
                              <br />
                              <button
                                onClick={() => payFine(transaction._id)}
                                disabled={transaction.isPaid}
                                style={{
                                  marginTop: "5px",
                                  padding: "4px 8px",
                                  backgroundColor: "#dc3545",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                              >
                                Pay Fine
                              </button>
                            </div>
                          )
                        ) : (
                          "No Fine"
                        )}
                      </td>

                      {/* 🔄 Return */}
                      <td>
                        {transaction.status === "Issued" ? (
                          <button
                            disabled={transaction.fine > 0 && !transaction.isPaid}
                            onClick={() => returnBook(transaction._id)}
                            className="return-btn"
                          >
                            Request Return
                          </button>
                        ) : (
                          <span className="badge issued">Return Requested</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
