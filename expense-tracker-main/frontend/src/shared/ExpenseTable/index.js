import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ExpenseTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedDate = location.state?.date ? new Date(location.state.date) : new Date();
  const dateKey = selectedDate.toDateString();

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses")) || {};
    const expensesForDate = Array.isArray(stored[dateKey]) ? stored[dateKey] : [];
    setExpenses(expensesForDate);
  }, [dateKey]);

  return (
    <div style={{ padding: "30px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{ marginBottom: "20px", padding: "8px 14px", borderRadius: "8px", cursor: "pointer" }}
      >
        ⬅ Back
      </button>
      <h2>Expenses for {dateKey}</h2>

      {expenses.length === 0 ? (
        <p>No expenses recorded for this date.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#0d6efd", color: "white" }}>
              <th>Expense Name</th>
              <th>Description</th>
              <th>Members</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr key={idx}>
                <td>{exp.expenseName}</td>
                <td>{exp.description}</td>
                <td>{exp.members.join(", ")}</td>
                <td>{exp.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseTable;
