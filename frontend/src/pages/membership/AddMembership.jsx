import { useState, useEffect } from "react";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import "./membership.css";

function AddMembership() {
  const [userId, setUserId] = useState("");
  const [type, setType] = useState("6 months");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(Server_URL + "users").then((res) => {
      setUsers(res.data.user);
    });
  }, []);

  const handleSubmit = async () => {
    if (!userId) return alert("Please select user");

    await axios.post(`${Server_URL}membership/add`, {
      userId,
      membershipType: type,
    });

    alert("Membership Added ✅");
  };

  return (
    <div className="membership-page">
      <div className="membership-card">
        <h2>Add Membership</h2>
        <p className="membership-subtitle">Assign a membership plan to a student account.</p>

        <div className="membership-field">
          <label>Select User</label>
          <select onChange={(e) => setUserId(e.target.value)} value={userId}>
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div className="membership-field">
          <label>Membership Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>6 months</option>
            <option>1 year</option>
            <option>2 years</option>
          </select>
        </div>

        <button className="membership-btn" onClick={handleSubmit}>
          Add Membership
        </button>
      </div>
    </div>
  );
}

export default AddMembership;