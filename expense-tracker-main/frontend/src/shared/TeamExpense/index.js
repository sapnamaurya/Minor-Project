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

  const [purpose, setPurpose] = useState(""); // instead of expenseName
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [categoryEditIndex, setCategoryEditIndex] = useState(null);

  // Categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryAmount, setNewCategoryAmount] = useState("");

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
  const handleAddCategory = () => {
    if (!newCategory || !newCategoryAmount) {
      alert("Enter category and amount!");
      return;
    }

    const updatedExpenses = [...allExpenses];

    if (categoryEditIndex !== null && editIndex !== null) {
      // Update existing category
      updatedExpenses[editIndex].categories[categoryEditIndex] = {
        category: newCategory,
        amount: parseFloat(newCategoryAmount),
      };
      setCategoryEditIndex(null);
      setEditIndex(null);
    } else if (allExpenses.length > 0) {
      // Add new category to last expense
      updatedExpenses[allExpenses.length - 1].categories.push({
        category: newCategory,
        amount: parseFloat(newCategoryAmount),
      });
    } else {
      alert("Please create an expense first before adding a category!");
      return;
    }

    saveToLocalStorage(updatedExpenses);
    setNewCategory("");
    setNewCategoryAmount("");
  };

  const handleEditCategory = (expIndex, catIndex) => {
    const category = allExpenses[expIndex].categories[catIndex];
    setNewCategory(category.category);
    setNewCategoryAmount(category.amount);
    setEditIndex(expIndex); // reuse editIndex for category
    // Optionally store category index in state if needed
    setCategoryEditIndex(catIndex);
  };

  const handleDeleteCategory = (expIndex, catIndex) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updatedExpenses = [...allExpenses];
      updatedExpenses[expIndex].categories.splice(catIndex, 1);
      saveToLocalStorage(updatedExpenses);
    }
  };

  const saveToLocalStorage = (updatedExpenses) => {
    setAllExpenses(updatedExpenses);
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || {};
    savedExpenses[dateKey] = updatedExpenses;
    localStorage.setItem("expenses", JSON.stringify(savedExpenses));
  };

  const handleSave = () => {
    if (editIndex !== null) {
      // Existing expense update
      const updatedExpenses = [...allExpenses];
      updatedExpenses[editIndex] = {
        ...updatedExpenses[editIndex],
        purpose: purpose || updatedExpenses[editIndex].purpose,
        description: description || updatedExpenses[editIndex].description,
        members:
          members.length > 0 ? members : updatedExpenses[editIndex].members,
        categories:
          categories.length > 0
            ? categories
            : updatedExpenses[editIndex].categories,
      };

      saveToLocalStorage(updatedExpenses);
      setEditIndex(null);
    } else {
      // New expense add (validation required)
      if (!purpose || !description) {
        alert("Fill purpose and description!");
        return;
      }

      if (members.length === 0 && categories.length === 0) {
        alert("Add at least one Member or one Category!");
        return;
      }

      const newExpense = {
        purpose,
        description,
        members,
        categories,
      };

      const updatedExpenses = [...allExpenses, newExpense];
      saveToLocalStorage(updatedExpenses);
    }

    // Reset only after save/update
    setPurpose("");
    setDescription("");
    setMembers([]);
    setCategories([]);
  };

  const handleEdit = (index) => {
    const exp = allExpenses[index];
    setPurpose(exp.purpose);
    setDescription(exp.description);
    setMembers(exp.members);
    setCategories(exp.categories || []);
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
  // CSV Export with two tables
  // CSV Export with Member Contributions and Category Expenses
  // const handleExportAllCSV = () => {
  //   // Member Contributions
  //   const memberData = allExpenses.flatMap((exp) =>
  //     exp.members.map((m) => ({
  //       Type: "Member",
  //       Purpose: exp.purpose,
  //       Description: exp.description,
  //       Name: m.name,
  //       Amount: m.amount,
  //     }))
  //   );

  //   // Add an empty row as separator (optional)
  //   const separator = [
  //     { Type: "", Purpose: "", Description: "", Name: "", Amount: "" },
  //   ];

  //   // Category Expenses
  //   const categoryData = allExpenses.flatMap((exp) =>
  //     exp.categories.map((c) => ({
  //       Type: "Category",
  //       Purpose: exp.purpose,
  //       Description: "",
  //       Name: c.category,
  //       Amount: c.amount,
  //     }))
  //   );

  //   const combinedData = [...memberData, ...separator, ...categoryData];

  //   const csv = Papa.unparse(combinedData);
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   saveAs(blob, `expenses-${dateKey}.csv`);
  // };

  // // PDF Export with two tables
  // const handleExportAllPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text(`Expenses Report - ${dateKey}`, 14, 10);

  //   // Member Contributions Table
  //   const memberData = allExpenses.flatMap((exp) =>
  //     exp.members.map((m) => [
  //       exp.purpose,
  //       exp.description,
  //       m.name,
  //       `$${m.amount}`,
  //     ])
  //   );

  //   if (memberData.length > 0) {
  //     doc.setFontSize(14);
  //     doc.text("👥 Member Contributions", 14, 20);
  //     autoTable(doc, {
  //       startY: 25,
  //       head: [["Purpose", "Description", "Member", "Amount"]],
  //       body: memberData,
  //     });
  //   }

  //   // Determine Y position after member table
  //   let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 25;

  //   // Category Expenses Table
  //   const categoryData = allExpenses.flatMap((exp) =>
  //     exp.categories.map((c) => [exp.purpose, c.category, `$${c.amount}`])
  //   );

  //   if (categoryData.length > 0) {
  //     doc.setFontSize(14);
  //     doc.text("📂 Category Expenses", 14, finalY);
  //     autoTable(doc, {
  //       startY: finalY + 5,
  //       head: [["Purpose", "Category", "Amount"]],
  //       body: categoryData,
  //     });
  //   }

  //   doc.save(`expenses-${dateKey}.pdf`);
  // };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/dd")} style={styles.backBtn}>
        ⬅ Back
      </button>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {/* Expense Form */}
        <div style={styles.card}>
          <h2 style={styles.heading}>
            {editIndex !== null ? "Edit Expense" : `Expense for ${dateKey}`}
          </h2>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Purpose:</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Manali Trip, Office Party"
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

          {/* Members */}
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

          {/* Categories */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Categories:</label>
            <div style={styles.chipContainer}>
              {categories.map((c, i) => (
                <div key={i} style={styles.chip}>
                  {c.category} (${c.amount})
                </div>
              ))}
            </div>
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name (e.g., Travel, Food)"
                style={styles.input}
              />
              <input
                type="number"
                value={newCategoryAmount}
                onChange={(e) => setNewCategoryAmount(e.target.value)}
                placeholder="Amount"
                style={styles.input}
              />
              <button onClick={handleAddCategory} style={styles.btn}>
                Add Category
              </button>
            </div>
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

            {/* Member Expenses Table */}
            <h4>👥 Member Contributions</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Purpose</th>
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
                      <td style={styles.td}>{exp.purpose}</td>
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

            {/* Category Expenses Table */}
            {/* Category Expenses Table */}
            <h4 style={{ marginTop: "30px" }}>📂 Category Expenses</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Purpose</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allExpenses.map((exp, expIndex) =>
                  exp.categories?.map((c, catIndex) => (
                    <tr key={`${expIndex}-${catIndex}`}>
                      <td style={styles.td}>{exp.purpose}</td>
                      <td style={styles.td}>{c.category}</td>
                      <td style={styles.td}>${c.amount}</td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleEditCategory(expIndex, catIndex)}
                          style={styles.actionBtn}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCategory(expIndex, catIndex)
                          }
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

            {/* Totals */}

            <div
              style={{
                marginTop: "20px",
                lineHeight: "22px",
                fontSize: "14px",
              }}
            >
              <h4>📊 Totals</h4>
              <ul>
                {Object.entries(totals).map(([member, total]) => (
                  <li key={member}>
                    {member}: <strong>${total}</strong>
                  </li>
                ))}
              </ul>

              <p>
                <strong>Total Member Contributions:</strong> $
                {filteredExpenses.reduce(
                  (s, e) => s + e.members.reduce((sum, m) => sum + m.amount, 0),
                  0
                )}
              </p>

              <p>
                <strong>Total Expense (Net):</strong> $
                {filteredExpenses.reduce(
                  (s, e) => s + e.members.reduce((sum, m) => sum + m.amount, 0),
                  0
                ) -
                  allExpenses.reduce(
                    (s, e) =>
                      s + e.categories.reduce((sum, c) => sum + c.amount, 0),
                    0
                  )}
              </p>
            </div>

            {/* Export Buttons */}
            {/* <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={handleExportAllCSV} style={styles.btn}>
                📄 Export All CSV
              </button>
              <button onClick={handleExportAllPDF} style={styles.btn}>
                📝 Export All PDF
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

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
  th: {
    fontSize: "14px",
    background: "#0d6efd",
    color: "white",
    padding: "12px",
  },
  td: { fontSize: "13px", borderBottom: "1px solid #dee2e6", padding: "10px" },
  actionBtn: { marginRight: "5px", padding: "4px 8px", cursor: "pointer" },
};
