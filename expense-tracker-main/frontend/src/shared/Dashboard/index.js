import React, { useState } from "react";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const Dash = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, member: "Alice", amount: 200, category: "Food" },
    { id: 2, member: "Bob", amount: 150, category: "Travel" },
    { id: 3, member: "Charlie", amount: 100, category: "Snacks" },
  ]);

  const [newExpense, setNewExpense] = useState({
    member: "",
    category: "",
    amount: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editExpense, setEditExpense] = useState({
    member: "",
    category: "",
    amount: "",
  });

  const total = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Find unique team members
  const teamMembers = [...new Set(expenses.map((e) => e.member))];
  const perPerson = teamMembers.length
    ? (total / teamMembers.length).toFixed(2)
    : 0;

  const data = expenses.reduce((acc, e) => {
    const existing = acc.find((d) => d.name === e.category);
    if (existing) {
      existing.value += e.amount;
    } else {
      acc.push({ name: e.category, value: e.amount });
    }
    return acc;
  }, []);

  const COLORS = ["#1976d2", "#ff9800", "#4caf50", "#f44336"];

  // Add expense
  const handleAddExpense = () => {
    if (!newExpense.member || !newExpense.category || !newExpense.amount) return;
    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        member: newExpense.member,
        category: newExpense.category,
        amount: Number(newExpense.amount),
      },
    ]);
    setNewExpense({ member: "", category: "", amount: "" });
  };

  // Delete expense
  const handleDelete = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Start editing
  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditExpense({ ...expense });
  };

  // Save edit
  const handleSaveEdit = () => {
    setExpenses(
      expenses.map((e) =>
        e.id === editingId
          ? { ...editExpense, amount: Number(editExpense.amount) }
          : e
      )
    );
    setEditingId(null);
    setEditExpense({ member: "", category: "", amount: "" });
  };

  return (
    <DashboardStyled>
      {/* Team Budget Overview */}
      <Card>
        <h2>Team Budget Overview</h2>
        <p>
          <strong>Total Expenses:</strong> ₹{total}
        </p>
        <p>
          <strong>Team Members:</strong> {teamMembers.length}
        </p>
        <p>
          <strong>Per Person Share:</strong> ₹{perPerson}
        </p>
      </Card>

      <div className="grid">
        {/* Member Expenses */}
        <Card>
          <h3>Member Expenses</h3>
          <List>
            {expenses.map((e) => (
              <ListItem key={e.id}>
                {editingId === e.id ? (
                  <EditForm>
                    <input
                      type="text"
                      value={editExpense.member}
                      onChange={(ev) =>
                        setEditExpense({ ...editExpense, member: ev.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editExpense.category}
                      onChange={(ev) =>
                        setEditExpense({ ...editExpense, category: ev.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={editExpense.amount}
                      onChange={(ev) =>
                        setEditExpense({ ...editExpense, amount: ev.target.value })
                      }
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </EditForm>
                ) : (
                  <>
                    <span>
                      <strong>{e.member}</strong> - {e.category}
                    </span>
                    <span className="amount">₹{e.amount}</span>
                    <div className="actions">
                      <button onClick={() => handleEdit(e)}>Edit</button>
                      <button onClick={() => handleDelete(e.id)}>Delete</button>
                    </div>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Card>

        {/* Expense Distribution Chart */}
        <Card>
          <h3>Expense Distribution</h3>
          <PieChart width={350} height={250}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Card>
      </div>

      {/* Add Expense Form */}
      <Card>
        <h3>Add New Expense</h3>
        <FormStyled>
          <input
            type="text"
            placeholder="Member"
            value={newExpense.member}
            onChange={(e) =>
              setNewExpense({ ...newExpense, member: e.target.value })
            }
          />
          <input
            type="text"
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
          <button onClick={handleAddExpense}>Add</button>
        </FormStyled>
      </Card>
    </DashboardStyled>
  );
};

/* ---------- Styled Components ---------- */
const DashboardStyled = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
`;

const Card = styled.div`
  border-radius: 15px;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.08);
  background: #fff;
  padding: 1.5rem;

  h2,
  h3 {
    margin-bottom: 0.8rem;
    color: #222260;
  }

  p {
    margin: 0.3rem 0;
    color: #444;
  }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;

  .amount {
    color: #1976d2;
    font-weight: bold;
  }

  .actions {
    display: flex;
    gap: 0.5rem;

    button {
      background: #1976d2;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.3rem 0.8rem;
      cursor: pointer;
      font-size: 0.85rem;

      &:hover {
        background: #1565c0;
      }
    }

    button:last-child {
      background: #f44336;

      &:hover {
        background: #d32f2f;
      }
    }
  }
`;

const FormStyled = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;

  input {
    flex: 1;
    min-width: 180px;
    font-size: 1rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 2px solid #e0e0e0;
    outline: none;
    background: #fafafa;
    color: #222260;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.06);

    &::placeholder {
      color: rgba(34, 34, 96, 0.5);
    }

    &:focus {
      border-color: #1976d2;
      background: #fff;
    }
  }

  button {
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #1565c0;
    }
  }
`;

const EditForm = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  width: 100%;

  input {
    flex: 1;
    min-width: 100px;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  button {
    background: #4caf50;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.4rem 0.8rem;
    cursor: pointer;

    &:hover {
      background: #388e3c;
    }
  }

  button:last-child {
    background: #9e9e9e;

    &:hover {
      background: #616161;
    }
  }
`;

export default Dash;
