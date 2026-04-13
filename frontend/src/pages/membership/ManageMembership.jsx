import { useState, useEffect } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import "./membership.css";

function ManageMembership() {
  const [userId, setUserId] = useState("");
  const [membership, setMembership] = useState(null);
  const [duration, setDuration] = useState("6 months");
  const [users, setUsers] = useState([]);

  // ✅ FETCH USERS (IMPORTANT)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${Server_URL}users`);
        setUsers(res.data.user || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // 🔍 Fetch membership
  const getMembership = async () => {
    if (!userId) {
      alert("Please select a user first");
      return;
    }
    try {
      const res = await axios.get(`${Server_URL}membership/${userId}`);
      setMembership(res.data.membership);
      setDuration(res.data.membership?.membershipType || "6 months");
    } catch (err) {
      alert("Membership not found ❌");
      setMembership(null);
    }
  };

  // 🔄 Extend
  const extendMembership = async () => {
    try {
      await axios.put(`${Server_URL}membership/extend/${membership._id}`, {
        duration,
      });
      alert("Extended ✅");
      getMembership();
    } catch (err) {
      alert("Error extending ❌");
    }
  };

  // ❌ Cancel
  const cancelMembership = async () => {
    try {
      await axios.put(`${Server_URL}membership/cancel/${membership._id}`);
      alert("Cancelled ❌");
      getMembership();
    } catch (err) {
      alert("Error cancelling ❌");
    }
  };

  return (
    <div className="membership-page">
      <div className="membership-card">
        <h2>Manage Membership</h2>
        <p className="membership-subtitle">Find a user and manage their membership status.</p>

        <div className="membership-search">
          <select onChange={(e) => setUserId(e.target.value)} value={userId}>
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button className="membership-btn secondary" onClick={getMembership}>Search</button>
        </div>

        {membership && (
          <div className="membership-details">
            <h3>Membership Details</h3>
            <p><strong>Type:</strong> {membership.membershipType}</p>
            <p><strong>Status:</strong> {membership.status}</p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(membership.endDate).toDateString()}
            </p>

            <div className="membership-field">
              <label>Extend Plan</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
              </select>
            </div>

            <div className="membership-actions">
              <button className="membership-btn" onClick={extendMembership}>Extend</button>
              <button className="membership-btn danger" onClick={cancelMembership}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageMembership;