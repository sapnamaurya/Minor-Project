// import React from "react";
// import { Bar, Pie } from "recharts";
// import "./style.css";
// import MainHeader from "../MainHeader";

// const ExpenseAnalysis = ({ expenses }) => {
//   const categoryData = Array.isArray(expenses)
//     ? expenses.reduce((acc, expense) => {
//         acc[expense.category] =
//           (acc[expense.category] || 0) + parseFloat(expense.amount);
//         return acc;
//       }, {})
//     : {};

//   const categoryChartData = Object.entries(categoryData).map(
//     ([category, amount]) => ({
//       name: category,
//       value: amount,
//     })
//   );
//   const monthlyData = Array.isArray(expenses)
//     ? expenses.reduce((acc, expense) => {
//         const month = expense.date?.substring(0, 7) || "Unknown";
//         acc[month] = (acc[month] || 0) + parseFloat(expense.amount || 0);
//         return acc;
//       }, {})
//     : {};

//   const monthlyChartData = Object.entries(monthlyData).map(
//     ([month, amount]) => ({
//       name: month,
//       value: amount,
//     })
//   );

//   return (
//     <>
//       <MainHeader />
//       <div className="analysis-container">
//         <h2>Expense Analysis</h2>

//         <div className="chart-container">
//           <h3>Expense by Category</h3>
//           <Pie
//             data={categoryChartData}
//             dataKey="value"
//             nameKey="name"
//             fill="#82ca9d"
//           />
//         </div>

//         <div className="chart-container">
//           <h3>Monthly Expense Trend</h3>
//           <Bar
//             data={monthlyChartData}
//             dataKey="value"
//             nameKey="name"
//             fill="#8884d8"
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ExpenseAnalysis;
