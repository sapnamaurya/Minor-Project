import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
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

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Chart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedDate = location.state?.date
    ? new Date(location.state.date)
    : new Date();
  const dateKey = selectedDate.toDateString();

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("expenses")) || {};
    const expensesForDate = Array.isArray(stored[dateKey])
      ? stored[dateKey]
      : [];
    setExpenses(expensesForDate);
  }, [dateKey]);

  // Calculate totals per member
  const memberTotals = {};
  expenses.forEach((exp) => {
    exp.members.forEach((m) => {
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

  // Calculate totals per category
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

  return (
    <div style={{ padding: "30px" }}>
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

      <h2>Charts for {dateKey}</h2>

      <div style={{ marginTop: "40px" }}>
        <h3>📊 Member Contributions</h3>
        <Bar
          data={memberChartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />
      </div>

      <div style={{ marginTop: "60px" }}>
        <h3>📂 Category Expenses</h3>
        <Pie data={categoryChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Chart;
