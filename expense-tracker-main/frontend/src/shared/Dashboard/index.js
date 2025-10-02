// import React, { useState } from "react";
// import styled from "styled-components";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// import { saveAs } from "file-saver";
// import Papa from "papaparse";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const Dash = () => {
//   const [expenses, setExpenses] = useState([
//     { id: 1, member: "Alice", amount: 200, category: "Food" },
//     { id: 2, member: "Bob", amount: 150, category: "Travel" },
//     { id: 3, member: "Charlie", amount: 100, category: "Snacks" },
//   ]);

//   const [newExpense, setNewExpense] = useState({
//     member: "",
//     category: "",
//     amount: "",
//   });

//   const [editingId, setEditingId] = useState(null);
//   const [editExpense, setEditExpense] = useState({
//     member: "",
//     category: "",
//     amount: "",
//   });

//   const total = expenses.reduce((acc, e) => acc + e.amount, 0);

//   // Find unique team members
//   const teamMembers = [...new Set(expenses.map((e) => e.member))];
//   const perPerson = teamMembers.length
//     ? (total / teamMembers.length).toFixed(2)
//     : 0;

//   const data = expenses.reduce((acc, e) => {
//     const existing = acc.find((d) => d.name === e.category);
//     if (existing) {
//       existing.value += e.amount;
//     } else {
//       acc.push({ name: e.category, value: e.amount });
//     }
//     return acc;
//   }, []);

//   const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];

//   // Add expense
//   const handleAddExpense = () => {
//     if (!newExpense.member || !newExpense.category || !newExpense.amount)
//       return;
//     setExpenses([
//       ...expenses,
//       {
//         id: expenses.length + 1,
//         member: newExpense.member,
//         category: newExpense.category,
//         amount: Number(newExpense.amount),
//       },
//     ]);
//     setNewExpense({ member: "", category: "", amount: "" });
//   };

//   // Delete expense
//   const handleDelete = (id) => {
//     setExpenses(expenses.filter((e) => e.id !== id));
//   };

//   // Start editing
//   const handleEdit = (expense) => {
//     setEditingId(expense.id);
//     setEditExpense({ ...expense });
//   };

//   // Save edit
//   const handleSaveEdit = () => {
//     setExpenses(
//       expenses.map((e) =>
//         e.id === editingId
//           ? { ...editExpense, amount: Number(editExpense.amount) }
//           : e
//       )
//     );
//     setEditingId(null);
//     setEditExpense({ member: "", category: "", amount: "" });
//   };

//   // Export to CSV
//   const handleExportCSV = () => {
//     const csv = Papa.unparse(expenses);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, "expenses.csv");
//   };

//   // Export to PDF
//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Expense Report", 14, 10);

//     autoTable(doc, {
//       startY: 20,
//       head: [["Member", "Category", "Amount"]],
//       body: expenses.map((exp) => [exp.member, exp.category, exp.amount]),
//     });

//     doc.save("expenses.pdf");
//   };

//   return (
//     <DashboardStyled>
//       {/* Team Budget Overview */}
//       <Card>
//         <h2>Team Budget Overview</h2>
//         <p>
//           <strong>Total Expenses:</strong> ₹{total}
//         </p>
//         <p>
//           <strong>Team Members:</strong> {teamMembers.length}
//         </p>
//         <p>
//           <strong>Per Person Share:</strong> ₹{perPerson}
//         </p>
//       </Card>

//       <div className="grid">
//         {/* Member Expenses */}
//         <Card>
//           <h3>Member Expenses</h3>
//           <List>
//             {expenses.map((e) => (
//               <ListItem key={e.id}>
//                 {editingId === e.id ? (
//                   <EditForm>
//                     <input
//                       type="text"
//                       value={editExpense.member}
//                       onChange={(ev) =>
//                         setEditExpense({
//                           ...editExpense,
//                           member: ev.target.value,
//                         })
//                       }
//                     />
//                     <input
//                       type="text"
//                       value={editExpense.category}
//                       onChange={(ev) =>
//                         setEditExpense({
//                           ...editExpense,
//                           category: ev.target.value,
//                         })
//                       }
//                     />
//                     <input
//                       type="number"
//                       value={editExpense.amount}
//                       onChange={(ev) =>
//                         setEditExpense({
//                           ...editExpense,
//                           amount: ev.target.value,
//                         })
//                       }
//                     />
//                     <button onClick={handleSaveEdit}>Save</button>
//                     <button onClick={() => setEditingId(null)}>Cancel</button>
//                   </EditForm>
//                 ) : (
//                   <>
//                     <span>
//                       <strong>{e.member}</strong> - {e.category}
//                     </span>
//                     <span className="amount">₹{e.amount}</span>
//                     <div className="actions">
//                       <button onClick={() => handleEdit(e)}>Edit</button>
//                       <button onClick={() => handleDelete(e.id)}>Delete</button>
//                     </div>
//                   </>
//                 )}
//               </ListItem>
//             ))}
//           </List>

//           {/* Export Buttons */}
//           <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
//             <button onClick={handleExportCSV}>Export CSV</button>
//             <button onClick={handleExportPDF}>Export PDF</button>
//           </div>
//         </Card>

//         {/* Expense Distribution Chart */}
//         <Card>
//           <h3>Expense Distribution</h3>
//           <PieChart width={350} height={264}>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               outerRadius={90}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </Card>
//       </div>

//       {/* Add Expense Form */}
//       <Card>
//         <h3>Add New Expense</h3>
//         <FormStyled>
//           <input
//             type="text"
//             placeholder="Member"
//             value={newExpense.member}
//             onChange={(e) =>
//               setNewExpense({ ...newExpense, member: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="Category"
//             value={newExpense.category}
//             onChange={(e) =>
//               setNewExpense({ ...newExpense, category: e.target.value })
//             }
//           />
//           <input
//             type="number"
//             placeholder="Amount"
//             value={newExpense.amount}
//             onChange={(e) =>
//               setNewExpense({ ...newExpense, amount: e.target.value })
//             }
//           />
//           <button onClick={handleAddExpense}>Add</button>
//         </FormStyled>
//       </Card>
//     </DashboardStyled>
//   );
// };

// /* ---------- Styled Components ---------- */
// const DashboardStyled = styled.div`
//   padding: 2rem;
//   display: flex;
//   flex-direction: column;
//   gap: 2rem;

//   .grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
//     gap: 2rem;
//   }
// `;

// const Card = styled.div`
//   border-radius: 15px;
//   box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.08);
//   background: #fff;
//   padding: 1.5rem;

//   h2,
//   h3 {
//     margin-bottom: 0.8rem;
//     color: #222260;
//   }

//   p {
//     margin: 0.3rem 0;
//     color: #444;
//   }

//   button {
//     background: #1976d2;
//     color: #fff;
//     border: none;
//     border-radius: 8px;
//     padding: 0.5rem 1rem;
//     font-weight: bold;
//     cursor: pointer;
//     transition: all 0.3s ease;

//     &:hover {
//       background: #1565c0;
//     }
//   }
// `;

// const List = styled.ul`
//   list-style: none;
//   margin: 0;
//   padding: 0;
// `;

// const ListItem = styled.li`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 1rem;
//   padding: 0.6rem 0;
//   border-bottom: 1px solid #eee;
//   font-size: 0.95rem;

//   .amount {
//     color: #1976d2;
//     font-weight: bold;
//   }

//   .actions {
//     display: flex;
//     gap: 0.5rem;

//     button {
//       background: #1976d2;
//       color: #fff;
//       border: none;
//       border-radius: 6px;
//       padding: 0.3rem 0.8rem;
//       cursor: pointer;
//       font-size: 0.85rem;

//       &:hover {
//         background: #1565c0;
//       }
//     }

//     button:last-child {
//       background: #f44336;

//       &:hover {
//         background: #d32f2f;
//       }
//     }
//   }
// `;

// const FormStyled = styled.div`
//   display: flex;
//   gap: 1rem;
//   flex-wrap: wrap;
//   margin-top: 1rem;

//   input {
//     flex: 1;
//     min-width: 180px;
//     font-size: 1rem;
//     padding: 0.6rem 1rem;
//     border-radius: 8px;
//     border: 2px solid #e0e0e0;
//     outline: none;
//     background: #fafafa;
//     color: #222260;
//     box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.06);

//     &::placeholder {
//       color: rgba(34, 34, 96, 0.5);
//     }

//     &:focus {
//       border-color: #1976d2;
//       background: #fff;
//     }
//   }
// `;

// const EditForm = styled.div`
//   display: flex;
//   gap: 0.5rem;
//   flex-wrap: wrap;
//   width: 100%;

//   input {
//     flex: 1;
//     min-width: 100px;
//     padding: 0.4rem 0.8rem;
//     border-radius: 6px;
//     border: 1px solid #ccc;
//   }

//   button {
//     background: #4caf50;
//     color: #fff;
//     border: none;
//     border-radius: 6px;
//     padding: 0.4rem 0.8rem;
//     cursor: pointer;

//     &:hover {
//       background: #388e3c;
//     }
//   }

//   button:last-child {
//     background: #9e9e9e;

//     &:hover {
//       background: #616161;
//     }
//   }
// `;

// export default Dash;
import React, { useState, useEffect, useRef } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Dash = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const barRef = useRef(null);
  const pieRef = useRef(null);

  // Aggregate monthly expenses from localStorage
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || {};
    const expenses = [];

    Object.entries(savedExpenses).forEach(([dateStr, dayExpenses]) => {
      const date = new Date(dateStr);
      if (
        date.getFullYear() === selectedMonth.getFullYear() &&
        date.getMonth() === selectedMonth.getMonth()
      ) {
        dayExpenses.forEach((exp) => {
          expenses.push({ ...exp, date: dateStr });
        });
      }
    });

    setMonthlyExpenses(expenses);
  }, [selectedMonth]);

  // Member totals
  const memberTotals = {};
  monthlyExpenses.forEach((exp) => {
    exp.members?.forEach((m) => {
      memberTotals[m.name] = (memberTotals[m.name] || 0) + m.amount;
    });
  });

  // Category totals
  const categoryTotals = {};
  monthlyExpenses.forEach((exp) => {
    exp.categories?.forEach((c) => {
      categoryTotals[c.category] = (categoryTotals[c.category] || 0) + c.amount;
    });
  });

  const memberChartData = {
    labels: Object.keys(memberTotals),
    datasets: [
      {
        label: "Amount Contributed ($)",
        data: Object.values(memberTotals),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Amount Spent ($)",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // CSV Export
  const handleExportCSV = () => {
    const memberData = monthlyExpenses.flatMap(
      (exp) =>
        exp.members?.map((m) => ({
          Date: exp.date,
          Type: "Member",
          Purpose: exp.purpose,
          Description: exp.description,
          Name: m.name,
          Amount: m.amount,
        })) || []
    );

    const separator = [
      {
        Date: "",
        Type: "",
        Purpose: "",
        Description: "",
        Name: "",
        Amount: "",
      },
    ];

    const categoryData = monthlyExpenses.flatMap(
      (exp) =>
        exp.categories?.map((c) => ({
          Date: exp.date,
          Type: "Category",
          Purpose: exp.purpose,
          Description: "",
          Name: c.category,
          Amount: c.amount,
        })) || []
    );

    const combinedData = [...memberData, ...separator, ...categoryData];
    const csv = Papa.unparse(combinedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(
      blob,
      `monthly-expenses-${
        selectedMonth.getMonth() + 1
      }-${selectedMonth.getFullYear()}.csv`
    );
  };

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const monthName = selectedMonth.toLocaleString("default", {
      month: "long",
    });
    const title = `Expenses Report - ${monthName} ${selectedMonth.getFullYear()}`;
    doc.setFontSize(16);
    doc.text(title, 14, 10);

    // Member table
    const memberData = monthlyExpenses.flatMap(
      (exp) =>
        exp.members?.map((m) => [
          exp.date,
          exp.purpose,
          exp.description,
          m.name,
          `$${m.amount}`,
        ]) || []
    );

    if (memberData.length > 0) {
      doc.setFontSize(14);
      doc.text("👥 Member Contributions", 14, 20);
      autoTable(doc, {
        startY: 25,
        head: [["Date", "Purpose", "Description", "Member", "Amount"]],
        body: memberData,
      });
    }

    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 25;

    // Category table
    const categoryData = monthlyExpenses.flatMap(
      (exp) =>
        exp.categories?.map((c) => [
          exp.date,
          exp.purpose,
          c.category,
          `$${c.amount}`,
        ]) || []
    );

    if (categoryData.length > 0) {
      doc.setFontSize(14);
      doc.text("📂 Category Expenses", 14, finalY);
      autoTable(doc, {
        startY: finalY + 5,
        head: [["Date", "Purpose", "Category", "Amount"]],
        body: categoryData,
      });
      finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : finalY + 40;
    }

    // Charts on the same page
    if (barRef.current && pieRef.current) {
      const barCanvas = barRef.current.canvas;
      const pieCanvas = pieRef.current.canvas;

      const barImg = barCanvas.toDataURL("image/png", 1.0);
      const pieImg = pieCanvas.toDataURL("image/png", 1.0);

      doc.addPage();
      doc.setFontSize(14);
      doc.text("👥 Member Contributions (Bar Chart)", 14, 20);
      doc.text("📊 Category Breakdown (Pie Chart)", 110, 20);

      // side by side
      doc.addImage(barImg, "PNG", 15, 30, 90, 90);
      doc.addImage(pieImg, "PNG", 110, 30, 90, 90);
    }

    doc.save(
      `monthly-expenses-${
        selectedMonth.getMonth() + 1
      }-${selectedMonth.getFullYear()}.pdf`
    );
  };

  return (
    <div
      style={{
        padding: "45px 74px 30px 87px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>
        Monthly Dashboard (
        {selectedMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
        )
      </h2>
      <input
        type="month"
        value={`${selectedMonth.getFullYear()}-${String(
          selectedMonth.getMonth() + 1
        ).padStart(2, "0")}`}
        onChange={(e) => setSelectedMonth(new Date(e.target.value))}
        style={{ padding: "8px", marginBottom: "30px", marginTop: "30px" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            height: "300px",
          }}
        >
          <h4>👥 Member Contributions</h4>
          <div style={{ height: "240px" }}>
            <Bar
              ref={barRef}
              data={memberChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            height: "300px",
          }}
        >
          <h4>📊 Category Breakdown</h4>
          <div style={{ height: "240px" }}>
            <Pie
              ref={pieRef}
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleExportCSV}
        style={{ marginRight: "10px", padding: "8px 14px" }}
      >
        📄 Export CSV
      </button>
      <button onClick={handleExportPDF} style={{ padding: "8px 14px" }}>
        📝 Export PDF
      </button>
    </div>
  );
};

export default Dash;
