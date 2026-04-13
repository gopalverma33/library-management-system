import axios from "axios";

const payFine = async (transactionId) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/transactions/pay-fine/${transactionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    alert("Fine paid successfully ✅");

    // Refresh UI (important)
    window.location.reload();

  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Error paying fine");
  }
};