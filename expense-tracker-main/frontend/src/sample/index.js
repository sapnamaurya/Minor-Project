// src/components/Dash.jsx
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import menuItems from "../utils/menuItems";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Full-featured Team Expense Dashboard
 * - Filter by member (search or dropdown)
 * - Table of expenses (editable)
 * - Per-member summary (paid / share / net)
 * - Settlement suggestions (who pays whom)
 * - Charts and export (CSV + PDF)
 *
 * Dependencies:
 *  - recharts
 *  - styled-components
 *  - papaparse
 *  - file-saver
 *  - jspdf + jspdf-autotable
 *
 * This is a single-file component for ease of copy/paste.
 */

const DD = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      member: "Alice",
      amount: 200,
      category: "Food",
      date: "2025-09-01",
    },
    {
      id: 2,
      member: "Bob",
      amount: 150,
      category: "Travel",
      date: "2025-09-02",
    },
    {
      id: 3,
      member: "Charlie",
      amount: 100,
      category: "Snacks",
      date: "2025-09-03",
    },
    {
      id: 4,
      member: "Sapna",
      amount: 500,
      category: "Office Supplies",
      date: "2025-09-05",
    },
    {
      id: 5,
      member: "Sapna",
      amount: 250,
      category: "Food",
      date: "2025-09-06",
    },
  ]);

  // Add / Edit state
  const [newExpense, setNewExpense] = useState({
    member: "",
    category: "",
    amount: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editExpense, setEditExpense] = useState({
    member: "",
    category: "",
    amount: "",
    date: "",
  });

  // Filter / search state
  const [selectedMember, setSelectedMember] = useState("");
  const [query, setQuery] = useState("");

  // Helpers
  const total = useMemo(
    () => expenses.reduce((acc, e) => acc + Number(e.amount), 0),
    [expenses]
  );

  // Unique members
  const members = useMemo(
    () => [...new Set(expenses.map((e) => e.member))],
    [expenses]
  );

  // Filter logic: type in search OR choose dropdown (dropdown overrides search if set)
  const filteredExpenses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (selectedMember) {
      return expenses.filter(
        (e) => e.member.toLowerCase() === selectedMember.toLowerCase()
      );
    }
    if (q) {
      return expenses.filter(
        (e) =>
          e.member.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          String(e.amount).includes(q) ||
          (e.date && e.date.includes(q))
      );
    }
    return expenses;
  }, [expenses, selectedMember, query]);

  // Data for pie chart (by category)
  const dataByCategory = useMemo(() => {
    const map = {};
    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const COLORS = [
    "#1976d2",
    "#ff9800",
    "#4caf50",
    "#f44336",
    "#9c27b0",
    "#00bcd4",
  ];

  // Add expense
  const handleAddExpense = () => {
    if (!newExpense.member || !newExpense.category || !newExpense.amount)
      return;
    const newItem = {
      id: (expenses.length ? Math.max(...expenses.map((e) => e.id)) : 0) + 1,
      member: newExpense.member,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      date: newExpense.date || new Date().toISOString().slice(0, 10),
    };
    setExpenses((prev) => [...prev, newItem]);
    setNewExpense({ member: "", category: "", amount: "", date: "" });
    // clear selectedMember to show new item in table if a filter was applied
    setSelectedMember("");
  };

  // Delete expense
  const handleDelete = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Edit handlers
  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setEditExpense({ ...exp });
  };

  const handleSaveEdit = () => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === editingId
          ? { ...editExpense, amount: Number(editExpense.amount) }
          : e
      )
    );
    setEditingId(null);
    setEditExpense({ member: "", category: "", amount: "", date: "" });
  };

  // Per-member summary: paid, share, net
  const memberSummary = useMemo(() => {
    const summary = {};
    const names = members;
    const num = names.length || 1;
    for (const name of names) summary[name] = { paid: 0, share: 0, net: 0 };

    for (const e of expenses) {
      summary[e.member].paid += Number(e.amount);
    }
    // fair share: total / members
    const fairShare = total / (names.length || 1);
    for (const name of names) {
      summary[name].share = Number(fairShare.toFixed(2));
      summary[name].net = Number(
        (summary[name].paid - summary[name].share).toFixed(2)
      );
    }
    return summary;
  }, [expenses, members, total]);

  // Settlement algorithm (greedy): returns array of { from, to, amount }
  const computeSettlements = (summaryObj) => {
    // Build arrays of debtors (net < 0) and creditors (net > 0)
    const debtors = [];
    const creditors = [];
    for (const [name, s] of Object.entries(summaryObj)) {
      const net = Number(s.net.toFixed(2));
      if (net < -0.01) debtors.push({ name, amount: -net }); // owes this amount
      else if (net > 0.01) creditors.push({ name, amount: net }); // should receive
    }
    // Sort for deterministic behavior
    debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => a.amount - b.amount);

    const settlements = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const owe = debtors[i];
      const recv = creditors[j];
      const transfer = Number(Math.min(owe.amount, recv.amount).toFixed(2));
      if (transfer > 0) {
        settlements.push({ from: owe.name, to: recv.name, amount: transfer });
        owe.amount = Number((owe.amount - transfer).toFixed(2));
        recv.amount = Number((recv.amount - transfer).toFixed(2));
      }
      if (Math.abs(owe.amount) < 0.01) i++;
      if (Math.abs(recv.amount) < 0.01) j++;
    }
    return settlements;
  };

  const settlements = useMemo(
    () => computeSettlements(memberSummary),
    [memberSummary]
  );

  // Export CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  };

  // Export PDF (full report)
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Team Expense Report", 14, 10);

    autoTable(doc, {
      startY: 18,
      head: [["Member", "Category", "Amount (₹)", "Date"]],
      body: expenses.map((exp) => [
        exp.member,
        exp.category,
        exp.amount,
        exp.date || "",
      ]),
    });

    // add a summary table below
    doc.text("Per-member Summary", 14, doc.lastAutoTable.finalY + 12);
    const summaryBody = Object.entries(memberSummary).map(([name, s]) => [
      name,
      `₹${s.paid}`,
      `₹${s.share}`,
      `₹${s.net}`,
    ]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Member", "Paid (₹)", "Share (₹)", "Net (₹)"]],
      body: summaryBody,
    });

    doc.save("expenses_report.pdf");
  };

  return (
    <DashboardStyled>
      <menuItems />
      <TopRow>
        <h1>Team Budget Tracker</h1>

        <Controls>
          <input
            placeholder="Search (member, category, amount or date)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedMember("");
            }}
          />
          <select
            value={selectedMember}
            onChange={(e) => {
              setSelectedMember(e.target.value);
              setQuery("");
            }}
          >
            <option value="">All Members</option>
            {members.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <button onClick={handleExportCSV}>Export CSV</button>
          <button onClick={handleExportPDF}>Export PDF</button>
        </Controls>
      </TopRow>

      <SummaryRow>
        <OverviewCard>
          <h3>Team Overview</h3>
          <p>
            <strong>Total Expenses:</strong> ₹{total}
          </p>
          <p>
            <strong>Members:</strong> {members.length}
          </p>
          <p>
            <strong>Per Person Share:</strong> ₹
            {members.length ? (total / members.length).toFixed(2) : 0}
          </p>
        </OverviewCard>

        <ChartCard>
          <h3>By Category</h3>
          <PieChart width={300} height={220}>
            <Pie
              data={dataByCategory}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {dataByCategory.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ChartCard>

        <BarCard>
          <h3>Per Member Spend</h3>
          <BarChart
            width={300}
            height={220}
            data={members.map((m) => ({
              name: m,
              spent: expenses
                .filter((e) => e.member === m)
                .reduce((acc, x) => acc + Number(x.amount), 0),
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spent" />
          </BarChart>
        </BarCard>
      </SummaryRow>

      <MainGrid>
        {/* Expenses Table */}
        <TableCard>
          <h3>Expenses</h3>

          <StyledTable>
            <thead>
              <tr>
                <th>Member</th>
                <th>Category</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Amount (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((e) => (
                <tr key={e.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        e.member
                      )}&background=1976d2&color=fff`}
                      alt={e.member}
                      style={{ width: 34, height: 34, borderRadius: "50%" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{e.member}</div>
                    </div>
                  </td>

                  <td>
                    {editingId === e.id ? (
                      <input
                        value={editExpense.category}
                        onChange={(ev) =>
                          setEditExpense({
                            ...editExpense,
                            category: ev.target.value,
                          })
                        }
                      />
                    ) : (
                      e.category
                    )}
                  </td>

                  <td>
                    {editingId === e.id ? (
                      <input
                        value={editExpense.date}
                        onChange={(ev) =>
                          setEditExpense({
                            ...editExpense,
                            date: ev.target.value,
                          })
                        }
                        type="date"
                      />
                    ) : (
                      e.date || ""
                    )}
                  </td>

                  <td style={{ textAlign: "right" }}>
                    {editingId === e.id ? (
                      <input
                        type="number"
                        value={editExpense.amount}
                        onChange={(ev) =>
                          setEditExpense({
                            ...editExpense,
                            amount: ev.target.value,
                          })
                        }
                      />
                    ) : (
                      `₹${e.amount}`
                    )}
                  </td>

                  <td>
                    {editingId === e.id ? (
                      <>
                        <small style={{ marginRight: 8 }}>
                          <button onClick={handleSaveEdit}>Save</button>
                        </small>
                        <small>
                          <button onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </small>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(e)}>Edit</button>
                        <button onClick={() => handleDelete(e.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No expenses to show
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>

          {/* Add expense small form */}
          <AddForm>
            <input
              placeholder="Member"
              value={newExpense.member}
              onChange={(e) =>
                setNewExpense({ ...newExpense, member: e.target.value })
              }
            />
            <input
              placeholder="Category"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
            />
            <button onClick={handleAddExpense}>Add</button>
          </AddForm>
        </TableCard>

        {/* Member Summary and Settlements */}
        <SideCard>
          <h3>Member Summary</h3>
          <SummaryList>
            {Object.entries(memberSummary).map(([name, s]) => (
              <li key={name}>
                <div>
                  <strong>{name}</strong>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    Paid: ₹{s.paid} • Share: ₹{s.share}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: s.net >= 0 ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  {s.net >= 0 ? `Get ₹${s.net}` : `Owe ₹${Math.abs(s.net)}`}
                </div>
              </li>
            ))}
          </SummaryList>

          <h4 style={{ marginTop: 16 }}>Suggested Settlements</h4>
          {settlements.length === 0 ? (
            <p style={{ color: "#666" }}>
              No settlements needed — balances are settled.
            </p>
          ) : (
            <SettlementList>
              {settlements.map((s, idx) => (
                <li key={idx}>
                  <span style={{ fontWeight: 600 }}>{s.from}</span> →{" "}
                  <span style={{ fontWeight: 600 }}>{s.to}</span>
                  <div style={{ fontWeight: 700 }}>₹{s.amount}</div>
                </li>
              ))}
            </SettlementList>
          )}
        </SideCard>
      </MainGrid>
    </DashboardStyled>
  );
};

/* ---------- Styled Components ---------- */

const DashboardStyled = styled.div`
  padding: 1.6rem;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
  color: #222;
  background: linear-gradient(180deg, #f6f8ff 0%, #ffffff 100%);
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  h1 {
    margin: 0;
    color: #1a237e;
    font-size: 1.4rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;

  input {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid #ddd;
    min-width: 260px;
  }

  select {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  button {
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    border: none;
    background: #1976d2;
    color: #fff;
    cursor: pointer;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const OverviewCard = styled.div`
  flex: 1;
  min-width: 220px;
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  h3 {
    margin: 0 0 0.6rem 0;
    color: #1a237e;
  }
`;

const ChartCard = styled(OverviewCard)`
  width: 320px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const BarCard = styled(OverviewCard)`
  width: 320px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  h3 {
    margin-top: 0;
    color: #1a237e;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0.75rem;

  th,
  td {
    padding: 0.65rem 0.5rem;
    border-bottom: 1px solid #f1f1f5;
    text-align: left;
    font-size: 0.95rem;
  }

  th {
    background: #eef3ff;
    color: #1a237e;
    font-weight: 600;
  }

  tr td input {
    width: 100%;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  tr:hover {
    background: #fbfcff;
  }
`;

const AddForm = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;

  input {
    padding: 0.5rem 0.6rem;
    border-radius: 8px;
    border: 1px solid #e6e6ee;
  }

  button {
    background: #1976d2;
    color: #fff;
    border: none;
    padding: 0.5rem 0.9rem;
    border-radius: 8px;
    cursor: pointer;
  }
`;

const SideCard = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  h3 {
    margin-top: 0;
    color: #1a237e;
  }
`;

const SummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: #fafbfd;
  }
`;

const SettlementList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 8px;
    background: #fff8f0;
    border: 1px solid #ffe5d0;
  }
`;

export default DD;
