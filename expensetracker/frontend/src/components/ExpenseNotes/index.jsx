import React, { useState } from "react";
import "./style.css"; // Import the CSS file

const ExpenseNotes = () => {
  const [expenseNotes, setExpenseNotes] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(""); // State for error message

  const handleNotesChange = (event) => {
    setExpenseNotes(event.target.value);
    setError(""); // Clear error when user types
  };

  const processExpenses = () => {
    if (!expenseNotes.trim()) {
      setError("Please add a note before adding expenses.");
      return;
    }

    const parsedExpenses = parseExpenseNotes(expenseNotes);
    if (parsedExpenses.length > 0) {
      setExpenses([...expenses, ...parsedExpenses]);
      setExpenseNotes(""); // Clear the input after processing
      setError(""); // Clear error if successful
    } else {
      setError("No valid expenses detected.");
    }
  };

  //   const parseExpenseNotes = (notes) => {
  //     const lines = notes.split("\n").filter((line) => line.trim() !== "");
  //     const extractedExpenses = [];

  //     lines.forEach((line) => {
  //       const amountMatch = line.match(/₹?\s*(\d+(\.\d{1,2})?)/);
  //       if (amountMatch) {
  //         const amount = parseFloat(amountMatch[1]);
  //         const description = line
  //           .substring(amountMatch.index + amountMatch[0].length)
  //           .trim();
  //         if (description) {
  //           extractedExpenses.push({
  //             description,
  //             amount,
  //             date: new Date().toLocaleDateString(),
  //           });
  //         }
  //       } else if (extractedExpenses.length > 0) {
  //         extractedExpenses[
  //           extractedExpenses.length - 1
  //         ].description += `\n${line.trim()}`;
  //       }
  //     });

  //     return extractedExpenses;
  //   };
  const parseExpenseNotes = (notes) => {
    const lines = notes.split("\n").filter((line) => line.trim() !== "");
    const extractedExpenses = [];

    lines.forEach((line) => {
      // Improved regex to detect amounts with or without ₹ symbol
      const amountMatch = line.match(/₹?\s*(\d+(\.\d{1,2})?)/);

      if (amountMatch) {
        const amount = parseFloat(amountMatch[1]);
        const description = line.replace(amountMatch[0], "").trim(); // Remove the matched amount from the description

        if (description) {
          extractedExpenses.push({
            description,
            amount,
            date: new Date().toLocaleDateString(),
          });
        }
      }
    });

    return extractedExpenses;
  };

  return (
    <div className="expense-container">
      <h2>Enter Expenses as Notes</h2>
      <textarea
        value={expenseNotes}
        onChange={handleNotesChange}
        placeholder="e.g., Bought groceries for ₹500\nLunch with John - ₹250"
        className="expense-textarea"
      />
      {error && <p className="error-message">{error}</p>} {/* Error message */}
      <button onClick={processExpenses} className="expense-button">
        Add Expenses
      </button>
      <h3>Recent Expenses</h3>
      {expenses.length > 0 ? (
        <ul className="expense-list">
          {expenses.map((expense, index) => (
            <li key={index} className="expense-item">
              <span>{expense.description}</span>
              <span className="expense-amount">₹{expense.amount}</span>
              <span className="expense-date">{expense.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-expense-text">No expenses added from notes yet.</p>
      )}
    </div>
  );
};

export default ExpenseNotes;
