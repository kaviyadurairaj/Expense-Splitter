import { useState } from "react";
import "../css/ExpenseList.css";

const ExpenseList = ({ expenses }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    return (
      (expense.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.payer.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterCategory === "" || expense.category === filterCategory)
    );
  });

  return (
    <div className="expense-list">
      <h3>Expense History</h3>
      <input
        type="text"
        placeholder="Search by description or payer"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
      </select>

      {filteredExpenses.length === 0 ? (
        <p>No expenses match your criteria.</p>
      ) : (
        <ul>
          {filteredExpenses.map((expense, index) => {
            // Format date correctly
            const formattedDate = expense.date
              ? new Date(expense.date).toLocaleDateString("en-GB") // Format: DD/MM/YYYY
              : "No Date Available";

            return (
              <li key={index}>
                {expense.desc} - ₹{expense.amount} paid by {expense.payer}
                <br />
                <strong>Date:</strong> {formattedDate}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
