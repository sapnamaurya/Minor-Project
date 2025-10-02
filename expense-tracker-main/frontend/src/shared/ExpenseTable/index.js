import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

// Icons
import { RiTeamFill } from "react-icons/ri";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const ExpenseTable = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedDate = location.state?.date
    ? new Date(location.state.date)
    : new Date();
  const dateKey = selectedDate.toDateString();

  const [expenses, setExpenses] = useState([]);

  // Chart refs
  const barRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses")) || {};
    const expensesForDate = Array.isArray(stored[dateKey])
      ? stored[dateKey]
      : [];
    setExpenses(expensesForDate);
  }, [dateKey]);

  // Totals per member
  const memberTotals = {};
  expenses.forEach((exp) => {
    exp.members?.forEach((m) => {
      memberTotals[m.name] = (memberTotals[m.name] || 0) + m.amount;
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

  // Totals per category
  const categoryTotals = {};
  expenses.forEach((exp) => {
    exp.categories?.forEach((c) => {
      categoryTotals[c.category] = (categoryTotals[c.category] || 0) + c.amount;
    });
  });

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
  const handleExportAllCSV = () => {
    const memberData = expenses.flatMap(
      (exp) =>
        exp.members?.map((m) => ({
          Type: "Member",
          Purpose: exp.purpose,
          Description: exp.description,
          Name: m.name,
          Amount: m.amount,
        })) || []
    );

    const separator = [
      { Type: "", Purpose: "", Description: "", Name: "", Amount: "" },
    ];

    const categoryData = expenses.flatMap(
      (exp) =>
        exp.categories?.map((c) => ({
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
    saveAs(blob, `expenses-${dateKey}.csv`);
  };

  // PDF Export
  const handleExportAllPDF = () => {
    const doc = new jsPDF();

    // ✅ Set clean font
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`Expenses Report - ${dateKey}`, 14, 10);

    // Member Table
    const memberData = expenses.flatMap(
      (exp) =>
        exp.members?.map((m) => [
          exp.purpose,
          exp.description,
          m.name,
          `$${m.amount}`,
        ]) || []
    );

    if (memberData.length > 0) {
      doc.setFontSize(14);
      doc.text("Member Contributions", 14, 20); // ✅ Removed emoji
      autoTable(doc, {
        startY: 25,
        head: [["Purpose", "Description", "Member", "Amount"]],
        body: memberData,
      });
    }

    let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 25;

    // Category Table
    const categoryData = expenses.flatMap(
      (exp) =>
        exp.categories?.map((c) => [exp.purpose, c.category, `$${c.amount}`]) ||
        []
    );

    if (categoryData.length > 0) {
      doc.setFontSize(14);
      doc.text("Category Expenses", 14, finalY); // ✅ Removed emoji
      autoTable(doc, {
        startY: finalY + 5,
        head: [["Purpose", "Category", "Amount"]],
        body: categoryData,
      });
      finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : finalY + 40;
    }

    // ✅ Add Charts as Images
    const barChart = barRef.current;
    const pieChart = pieRef.current;

    if (barChart) {
      const barImg = barChart.toBase64Image();
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Member Contributions (Bar Chart)", 14, 20);
      doc.addImage(barImg, "PNG", 15, 30, 180, 100);
    }

    if (pieChart) {
      const pieImg = pieChart.toBase64Image();
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Category Breakdown (Pie Chart)", 14, 20);
      doc.addImage(pieImg, "PNG", 15, 30, 180, 100);
    }

    doc.save(`expenses-${dateKey}.pdf`);
  };

  return (
    <div
      style={{
        padding: "30px 110px",
        fontFamily: "'Segoe UI', Arial, sans-serif", // ✅ Consistent font
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <button
        onClick={() => navigate("/dash")}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <h2>Expense Dashboard for {dateKey}</h2>

      {expenses.length === 0 ? (
        <p>No expenses recorded for this date.</p>
      ) : (
        <>
          {/* Tables */}
          <div
            style={{
              marginTop: "20px",
              gap: "121px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              marginBottom: "42px",
            }}
          >
            <div>
              <h3 style={{ marginBottom: "25px" }}>
                <RiTeamFill /> Member Contributions
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr style={{ background: "#0d6efd", color: "white" }}>
                    <th>Purpose</th>
                    <th>Description</th>
                    <th>Member</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, i) =>
                    exp.members?.map((m, j) => (
                      <tr key={`${i}-${j}`} style={{ fontSize: "16px" }}>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {exp.purpose}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {exp.description}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {m.name}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          ${m.amount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h3 style={{ marginBottom: "25px" }}>Category Expenses</h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr style={{ background: "#0d6efd", color: "white" }}>
                    <th>Purpose</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp, i) =>
                    exp.categories?.map((c, j) => (
                      <tr key={`${i}-${j}`} style={{ fontSize: "16px" }}>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {exp.purpose}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {c.category}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          ${c.amount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              marginTop: "20px",
            }}
          >
            {/* Member Contributions (Bar Chart) */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                height: "350px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
                <RiTeamFill /> Member Contributions
              </h4>
              <div style={{ flexGrow: 1 }}>
                <Bar
                  ref={barRef}
                  data={memberChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 50 } },
                    },
                  }}
                />
              </div>
            </div>

            {/* Category Breakdown (Pie Chart) */}
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                height: "350px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
                📊 Category Breakdown
              </h4>
              <div style={{ flexGrow: 1 }}>
                <Pie
                  ref={pieRef}
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div style={{ marginTop: "40px", display: "flex", gap: "15px" }}>
            <button
              onClick={handleExportAllCSV}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#0d6efd",
                color: "white",
                cursor: "pointer",
              }}
            >
              📄 Export CSV
            </button>
            <button
              onClick={handleExportAllPDF}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#198754",
                color: "white",
                cursor: "pointer",
              }}
            >
              📝 Export PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseTable;
