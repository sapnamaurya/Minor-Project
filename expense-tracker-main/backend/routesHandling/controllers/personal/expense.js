import { pool } from "../../../db.js";

export const addExpense = async (req, res) => {
  const { amount, category_id, description, date } = req.body;
  const user_id = req.user?.userId;

  try {
    if (!amount || !category_id || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    const query = `
      INSERT INTO expenses (amount, category_id, description, date, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [amount, category_id, description, date, user_id];
    const result = await pool.query(query, values);

    res.status(200).json({ message: "Expense Added", expense: result.rows[0] });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllExpenses = async (req, res) => {
  const userId = req.user?.userId;
  try {
    const query = `SELECT * FROM expenses WHERE user_id = $1;`;
    const result = await pool.query(query, [userId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE FROM expenses
      WHERE expense_id = $1;
    `;
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Expense Deleted" });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT * FROM expenses
      WHERE expense_id  = $1;
    `;
    const values = [id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, category_id, description, date } = req.body;

  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (amount !== undefined) {
      fields.push(`amount = $${paramIndex++}`);
      values.push(amount);
    }
    if (category_id !== undefined) {
      fields.push(`category_id = $${paramIndex++}`);
      values.push(category_id);
    }
    if (description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (date !== undefined) {
      fields.push(`date = $${paramIndex++}`);
      values.push(date);
    }

    // Ensure at least one field is being updated
    if (fields.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided for update." });
    }

    values.push(id); // Add id as the last parameter

    const query = `
      UPDATE expenses
      SET ${fields.join(", ")}
      WHERE expense_id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpensesByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: "Category are required!" });
  }

  try {
    const query = `
      SELECT * FROM expenses
      WHERE category= $1;
    `;
    const values = [category];
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses by category:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const checkUserTotalLimit = async (req, res) => {
  const user_id = req.user.userId;

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required!" });
  }

  try {
    // Step 1: Get user's monthly limit
    const userQuery = `SELECT monthlyLimit FROM users WHERE user_id = $1;`;
    const userResult = await pool.query(userQuery, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log(userResult.rows[0]);
    const monthlyLimit = parseFloat(userResult.rows[0].monthlylimit);

    // Step 2: Sum all expenses for that user
    const totalQuery = `
      SELECT SUM(amount) AS total_amount
      FROM expenses
      WHERE user_id = $1;
    `;
    const totalResult = await pool.query(totalQuery, [user_id]);

    const totalAmount = parseFloat(totalResult.rows[0].total_amount) || 0;

    // Step 3: Compare with user's limit
    const isExceeded = totalAmount > monthlyLimit;

    res.status(200).json({
      user_id,
      totalAmount,
      monthlyLimit,
      alert: isExceeded
        ? `Alert: You have exceeded your total monthly limit of ${monthlyLimit}!`
        : null,
    });
  } catch (error) {
    console.error("Error checking user total limit:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
