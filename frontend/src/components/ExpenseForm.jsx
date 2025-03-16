import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ExpenseForm.css";

const ExpenseForm = ({ addExpense, addMember, removeMember, members }) => {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [percentages, setPercentages] = useState({});
  const [newMember, setNewMember] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc || !amount || !payer) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const expense = {
      userId,
      desc,
      amount: parseFloat(amount),
      payer,
      splitType,
      percentages,
    };

    addExpense(expense);
    setDesc("");
    setAmount("");
    setPayer("");
    setPercentages({});

    setTimeout(() => navigate("/balance-sheet"), 100);
  };

  const handleAddMember = () => {
    if (newMember && !members.some((member) => member.name === newMember)) {
      addMember(newMember);
      setNewMember("");
    }
  };

  const handlePercentageChange = (memberName, value) => {
    setPercentages((prev) => ({ ...prev, [memberName]: value }));
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="expense-form">
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Expense Description"
        /><br/>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        /><br/>
        <input
          type="text"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          placeholder="Payer Name"
        /><br/>

        <div>
          <label>Split Type:</label>
          <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
            <option value="equal">Equal</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        {splitType === "percentage" && (
          <div className="percentage-inputs">
            <h4>Enter Split Percentages:</h4>
            {members.map((member) => (
              <div key={member._id}>
                {member.name}:
                <input
                  type="number"
                  value={percentages[member.name] || ""}
                  onChange={(e) => handlePercentageChange(member.name, e.target.value)}
                  placeholder="%"
                />
              </div>
            ))}
          </div>
        )}

        <button type="submit">Add Expense</button>
      </form>

      <div className="member-section">
        <div className="add-member">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Add Member Name"
          />
          <button onClick={handleAddMember}>Add Member</button>
        </div>

        <div className="member-container">
          <h3>Group Members</h3>
          <ul>
            {members.map((member) => (
              <li key={member._id}>
                {member.name}
                <button
                  className="delete-member-btn"
                  onClick={() => removeMember(member._id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
