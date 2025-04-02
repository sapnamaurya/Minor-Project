import React, { useState } from "react";
import "./style.css";
import MainHeader from "../MainHeader";
import Footer from "../Footer/Footer";

const ExpenseEntry = () => {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !category || !amount || !description) {
      setError("All fields except payment method are required.");
      return;
    }
    const newExpense = { date, category, amount, paymentMethod, description };
    setExpenses([...expenses, newExpense]);
    setDate("");
    setCategory("");
    setAmount("");
    setDescription("");
    setError("");
  };

  const handleDelete = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  return (
    <>
      <MainHeader />
      <div className="expense-container">
        <h2>Expense Entry</h2>
        <form onSubmit={handleSubmit} className="expense-form">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={20}
            required
          />

          <label>Amount (₹):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div style={{ display: "flex" }}>
            <label style={{ marginRight: "9%" }}>Payment Method:</label>

            <input
              type="radio"
              id="online"
              name="paymentMethod"
              className="checkbox"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="online" style={{ marginRight: "9%" }}>
              Online
            </label>
            <input
              type="radio"
              id="cash"
              name="paymentMethod"
              value="Cash"
              className="checkbox"
              checked={paymentMethod === "Cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cash">Cash</label>
          </div>

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            required
          />

          {error && <p className="error-message">{error}</p>}
          <button type="submit">Add Expense</button>
        </form>

        <h3>Recent Expenses</h3>
        {expenses.length > 0 ? (
          <ul className="expense-list">
            {expenses.map((expense, index) => (
              <li key={index} className="expense-item">
                <span>{expense.date}</span> - <span>{expense.category}</span> -{" "}
                <span>₹{expense.amount}</span> -{" "}
                <span>{expense.paymentMethod}</span> -{" "}
                <span>{expense.description}</span>
                <button onClick={() => handleDelete(index)} className="cross">
                  ❌
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-expense-text">No expenses added yet.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ExpenseEntry;
