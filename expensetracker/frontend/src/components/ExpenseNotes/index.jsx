// import React, { useState } from "react";
// import "./style.css"; // Import the CSS file

// const ExpenseNotes = () => {
//   const [expenseNotes, setExpenseNotes] = useState("");
//   const [expenses, setExpenses] = useState([]);
//   const [error, setError] = useState(""); // State for error message

//   const handleNotesChange = (event) => {
//     setExpenseNotes(event.target.value);
//     setError(""); // Clear error when user types
//   };

//   const processExpenses = () => {
//     if (!expenseNotes.trim()) {
//       setError("Please add a note before adding expenses.");
//       return;
//     }

//     const parsedExpenses = parseExpenseNotes(expenseNotes);
//     if (parsedExpenses.length > 0) {
//       setExpenses([...expenses, ...parsedExpenses]);
//       setExpenseNotes(""); // Clear the input after processing
//       setError(""); // Clear error if successful
//     } else {
//       setError("No valid expenses detected.");
//     }
//   };

//   //   const parseExpenseNotes = (notes) => {
//   //     const lines = notes.split("\n").filter((line) => line.trim() !== "");
//   //     const extractedExpenses = [];

//   //     lines.forEach((line) => {
//   //       const amountMatch = line.match(/₹?\s*(\d+(\.\d{1,2})?)/);
//   //       if (amountMatch) {
//   //         const amount = parseFloat(amountMatch[1]);
//   //         const description = line
//   //           .substring(amountMatch.index + amountMatch[0].length)
//   //           .trim();
//   //         if (description) {
//   //           extractedExpenses.push({
//   //             description,
//   //             amount,
//   //             date: new Date().toLocaleDateString(),
//   //           });
//   //         }
//   //       } else if (extractedExpenses.length > 0) {
//   //         extractedExpenses[
//   //           extractedExpenses.length - 1
//   //         ].description += `\n${line.trim()}`;
//   //       }
//   //     });

//   //     return extractedExpenses;
//   //   };
//   const parseExpenseNotes = (notes) => {
//     const lines = notes.split("\n").filter((line) => line.trim() !== "");
//     const extractedExpenses = [];

//     lines.forEach((line) => {
//       // Improved regex to detect amounts with or without ₹ symbol
//       const amountMatch = line.match(/₹?\s*(\d+(\.\d{1,2})?)/);

//       if (amountMatch) {
//         const amount = parseFloat(amountMatch[1]);
//         const description = line.replace(amountMatch[0], "").trim(); // Remove the matched amount from the description

//         if (description) {
//           extractedExpenses.push({
//             description,
//             amount,
//             date: new Date().toLocaleDateString(),
//           });
//         }
//       }
//     });

//     return extractedExpenses;
//   };

//   return (
//     <div className="expense-container">
//       <h2>Enter Expenses as Notes</h2>
//       <textarea
//         value={expenseNotes}
//         onChange={handleNotesChange}
//         placeholder="e.g., Bought groceries for ₹500\nLunch with John - ₹250"
//         className="expense-textarea"
//       />
//       {error && <p className="error-message">{error}</p>} {/* Error message */}
//       <button onClick={processExpenses} className="expense-button">
//         Add Expenses
//       </button>
//       <h3>Recent Expenses</h3>
//       {expenses.length > 0 ? (
//         <ul className="expense-list">
//           {expenses.map((expense, index) => (
//             <li key={index} className="expense-item">
//               <span>{expense.description}</span>
//               <span className="expense-amount">₹{expense.amount}</span>
//               <span className="expense-date">{expense.date}</span>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="no-expense-text">No expenses added from notes yet.</p>
//       )}
//     </div>
//   );
// };

// export default ExpenseNotes;
// import React, { useState } from "react";
// import "./style.css"; // Import the CSS file
// import MainHeader from "../MainHeader";

// const ExpenseNotes = () => {
//   const [expenseNotes, setExpenseNotes] = useState("");
//   const [expenses, setExpenses] = useState([]);
//   const [error, setError] = useState(""); // State for error message

//   const handleNotesChange = (event) => {
//     setExpenseNotes(event.target.value);
//     setError(""); // Clear error when user types
//   };

//   const processExpenses = () => {
//     if (!expenseNotes.trim()) {
//       setError("Please add a note before adding expenses.");
//       return;
//     }

//     const parsedExpenses = parseExpenseNotes(expenseNotes);
//     if (parsedExpenses.length > 0) {
//       setExpenses([...expenses, ...parsedExpenses]);
//       setExpenseNotes(""); // Clear the input after processing
//       setError(""); // Clear error if successful
//     } else {
//       setError("No valid expenses detected.");
//     }
//   };

//   const handleDeleteExpense = (index) => {
//     const updatedExpenses = expenses.filter((_, i) => i !== index);
//     setExpenses(updatedExpenses);
//   };

//   //     const lines = notes.split("\n").filter((line) => line.trim() !== "");
//   //     const extractedExpenses = [];

//   //     lines.forEach((line) => {
//   //       const amountMatch = line.match(/₹?\s*(\d+(\.\d{1,2})?)/);
//   //       if (amountMatch) {
//   //         const amount = parseFloat(amountMatch[1]);
//   //         const description = line
//   //           .substring(amountMatch.index + amountMatch[0].length)
//   //           .trim();
//   //         if (description) {
//   //           extractedExpenses.push({
//   //             description,
//   //             amount,
//   //             date: new Date().toLocaleDateString(),
//   //           });
//   //         }
//   //       } else if (extractedExpenses.length > 0) {
//   //         extractedExpenses[
//   //           extractedExpenses.length - 1
//   //         ].description += `\n${line.trim()}`;
//   //       }
//   //     });

//   //     return extractedExpenses;
//   //   };
//   const parseExpenseNotes = (notes) => {
//     const lines = notes.split("\n").filter((line) => line.trim() !== "");
//     const extractedExpenses = [];

//     lines.forEach((line) => {
//       const amountMatch = line.match(/(?:₹\s*)?(\d+(\.\d{1,2})?)/); // Now detects ₹ or without ₹
//       if (amountMatch) {
//         const amount = parseFloat(amountMatch[1]);
//         const description = line.replace(amountMatch[0], "").trim(); // Remove amount from line
//         if (description) {
//           extractedExpenses.push({
//             description,
//             amount,
//             date: new Date().toLocaleDateString(),
//           });
//         }
//       }
//     });

//     return extractedExpenses;
//   };

//   return (
//     <>
//       <MainHeader />
//       <div className="expense-container">
//         <h2>Enter Expenses as Notes</h2>
//         <textarea
//           value={expenseNotes}
//           onChange={handleNotesChange}
//           placeholder="e.g., groceries ₹500"
//           className="expense-textarea"
//         />
//         {error && <p className="error-message">{error}</p>}{" "}
//         {/* Error message */}
//         <button onClick={processExpenses} className="expense-button">
//           Add Expenses
//         </button>
//         <h3>Recent Expenses</h3>
//         {expenses.length > 0 ? (
//           <ul className="expense-list">
//             {expenses.map((expense, index) => (
//               <li key={index} className="expense-item">
//                 <span style={{ marginLeft: "4%" }}>{expense.description}</span>
//                 <span className="expense-amount">₹{expense.amount}</span>
//                 <span className="expense-date">{expense.date}</span>
//                 <button
//                   onClick={() => handleDeleteExpense(index)}
//                   className="delete-button"
//                 >
//                   ❌
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="no-expense-text">No expenses added from notes yet.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default ExpenseNotes;

import React, { useState } from "react";
import "./style.css";
import MainHeader from "../MainHeader";

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
    </>
  );
};

export default ExpenseEntry;
