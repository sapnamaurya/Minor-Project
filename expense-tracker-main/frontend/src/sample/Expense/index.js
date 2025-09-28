import React from "react";
import styled from "styled-components";

const Expense = ({
  expenses,
  filteredExpenses,
  newExpense,
  setNewExpense,
  handleAddExpense,
  handleDelete,
  handleEdit,
  editingId,
  editExpense,
  setEditExpense,
  handleSaveEdit,
}) => {
  return (
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
                <div style={{ fontWeight: 600 }}>{e.member}</div>
              </td>

              <td>
                {editingId === e.id ? (
                  <input
                    value={editExpense.category}
                    onChange={(ev) =>
                      setEditExpense({ ...editExpense, category: ev.target.value })
                    }
                  />
                ) : (
                  e.category
                )}
              </td>

              <td>
                {editingId === e.id ? (
                  <input
                    type="date"
                    value={editExpense.date}
                    onChange={(ev) =>
                      setEditExpense({ ...editExpense, date: ev.target.value })
                    }
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
                      setEditExpense({ ...editExpense, amount: ev.target.value })
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
                      <button onClick={() => setEditExpense({})}>Cancel</button>
                    </small>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(e)}>Edit</button>
                    <button onClick={() => handleDelete(e.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {filteredExpenses.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                No expenses to show
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>

      {/* Add Expense Form */}
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
  );
};

/* ---------- Styled ---------- */
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

export default Expense;
