import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TeamExpense = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const date = location.state?.date
    ? new Date(location.state.date)
    : new Date();
  const dateKey = date.toDateString();

  const [allExpenses, setAllExpenses] = useState(() => {
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || {};
    return Array.isArray(savedExpenses[dateKey]) ? savedExpenses[dateKey] : [];
  });

  const [expenseName, setExpenseName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [filterMember, setFilterMember] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddMember = () => {
    if (newMember.trim() !== "" && newAmount.trim() !== "") {
      setMembers([
        ...members,
        { name: newMember, amount: parseFloat(newAmount) },
      ]);
      setNewMember("");
      setNewAmount("");
      setShowInput(false);
    } else {
      alert("Enter member name and amount!");
    }
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const saveToLocalStorage = (updatedExpenses) => {
    setAllExpenses(updatedExpenses);
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || {};
    savedExpenses[dateKey] = updatedExpenses;
    localStorage.setItem("expenses", JSON.stringify(savedExpenses));
  };

  const handleSave = () => {
    if (!expenseName || !description || members.length === 0) {
      alert("Fill all fields and add at least one member!");
      return;
    }

    const newExpense = {
      expenseName,
      description,
      members,
    };

    let updatedExpenses;
    if (editIndex !== null) {
      updatedExpenses = [...allExpenses];
      updatedExpenses[editIndex] = newExpense;
      setEditIndex(null);
    } else {
      updatedExpenses = [...allExpenses, newExpense];
    }

    saveToLocalStorage(updatedExpenses);

    setExpenseName("");
    setDescription("");
    setMembers([]);
  };

  const handleEdit = (index) => {
    const exp = allExpenses[index];
    setExpenseName(exp.expenseName);
    setDescription(exp.description);
    setMembers(exp.members);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const updatedExpenses = allExpenses.filter((_, i) => i !== index);
      saveToLocalStorage(updatedExpenses);
    }
  };

  const filteredExpenses = allExpenses
    .map((exp) => {
      if (!filterMember) return exp;
      const filteredMembers = exp.members.filter((m) =>
        m.name.toLowerCase().includes(filterMember.toLowerCase())
      );
      return { ...exp, members: filteredMembers };
    })
    .filter((exp) => exp.members.length > 0);

  const totals = {};
  filteredExpenses.forEach((exp) => {
    exp.members.forEach((m) => {
      totals[m.name] = (totals[m.name] || 0) + m.amount;
    });
  });

  // CSV Export
  const handleExportCSV = () => {
    const dataToExport = filteredExpenses.flatMap((exp) =>
      exp.members.map((m) => ({
        "Expense Name": exp.expenseName,
        Description: exp.description,
        Member: m.name,
        Amount: m.amount,
      }))
    );
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `expenses-${dateKey}.csv`);
  };

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Expense Report - ${dateKey}`, 14, 10);

    const bodyData = filteredExpenses.flatMap((exp) =>
      exp.members.map((m) => [m.name, exp.expenseName, m.amount])
    );

    autoTable(doc, {
      startY: 20,
      head: [["Member", "Category", "Amount"]],
      body: bodyData,
    });

    doc.save(`expenses-${dateKey}.pdf`);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/home")} style={styles.backBtn}>
        ⬅ Back
      </button>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {/* Expense Form */}
        <div style={styles.card}>
          <h2 style={styles.heading}>
            {editIndex !== null ? "Edit Expense" : `Expense for ${dateKey}`}
          </h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Expense Name:</label>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="Enter expense name"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              style={styles.textarea}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Members & Amount:</label>
            <div style={styles.chipContainer}>
              {members.map((m, i) => (
                <div key={i} style={styles.chip}>
                  {m.name} (${m.amount})
                  <span
                    onClick={() => handleRemoveMember(i)}
                    style={styles.removeIcon}
                  >
                    ❌
                  </span>
                </div>
              ))}
            </div>

            {showInput ? (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Member name"
                  style={styles.input}
                />
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Amount"
                  style={styles.input}
                />
                <button onClick={handleAddMember} style={styles.btn}>
                  Add
                </button>
              </div>
            ) : (
              <button onClick={() => setShowInput(true)} style={styles.btn}>
                ➕ Add Member
              </button>
            )}
          </div>

          <button onClick={handleSave} style={styles.saveBtn}>
            💾 {editIndex !== null ? "Update Expense" : "Save Expense"}
          </button>
        </div>

        {/* Expense Table */}
        {allExpenses.length > 0 && (
          <div style={styles.tableCard}>
            <h3 style={styles.subHeading}>Saved Expenses</h3>

            <input
              type="text"
              placeholder="Filter by Member"
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              style={styles.input}
            />

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Expense Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, i) =>
                  exp.members.map((m, j) => (
                    <tr key={`${i}-${j}`}>
                      <td style={styles.td}>{exp.expenseName}</td>
                      <td style={styles.td}>{exp.description}</td>
                      <td style={styles.td}>{m.name}</td>
                      <td style={styles.td}>${m.amount}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleEdit(i)}
                          style={styles.actionBtn}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(i)}
                          style={styles.actionBtn}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ marginTop: "20px" }}>
              <h4>Total by Member:</h4>
              <ul>
                {Object.entries(totals).map(([member, total]) => (
                  <li key={member}>
                    {member}: <strong>${total}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* Export Buttons */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={handleExportCSV} style={styles.btn}>
                📄 Export CSV
              </button>
              <button onClick={handleExportPDF} style={styles.btn}>
                📝 Export PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ...styles object remains the same

// ...styles object remains same

export default TeamExpense;

const styles = {
  container: {
    margin: "40px",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    padding: "20px",
  },
  backBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#6c757d",
    color: "white",
    cursor: "pointer",
    marginBottom: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    flex: "1",
  },
  tableCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    maxWidth: "800px",
    flex: "1",
  },
  heading: { fontSize: "22px", marginBottom: "20px", color: "#343a40" },
  subHeading: { fontSize: "18px", marginBottom: "15px", color: "#495057" },
  inputGroup: { marginBottom: "15px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#495057",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ced4da",
    outline: "none",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ced4da",
    outline: "none",
    resize: "none",
    marginBottom: "10px",
  },
  btn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#0d6efd",
    color: "white",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#198754",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  chipContainer: { display: "flex", flexWrap: "wrap", gap: "10px" },
  chip: {
    background: "#e9ecef",
    borderRadius: "20px",
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
  },
  removeIcon: { marginLeft: "8px", cursor: "pointer", color: "red" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    marginTop: "15px",
  },
  th: { background: "#0d6efd", color: "white", padding: "12px" },
  td: { borderBottom: "1px solid #dee2e6", padding: "10px" },
  actionBtn: { marginRight: "5px", padding: "4px 8px", cursor: "pointer" },
};
