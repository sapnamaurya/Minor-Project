import { pool } from "../../../db.js";
export const createBusinessIncome = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    const { title, amount, category, description, date } = req.body;

    // Enhanced Validation
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized: user ID missing" });
    }

    if (!title || !amount || !date || !category) {
      return res
        .status(400)
        .json({ message: "Title, amount, category, and date are required" });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    const result = await pool.query(
      `INSERT INTO businessincome 
        (title, user_id, amount, category, description, date) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *`,
      [title, user_id, amount, category, description, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating business income:", error);
    res.status(500).json({ message: "Failed to create business income" });
  }
};
export const getAllBusinessIncomes = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID" });
    }

    const result = await pool.query(
      "SELECT * FROM businessIncome WHERE user_id = $1",
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching business incomes:", error);
    res.status(500).json({ message: "Failed to retrieve business incomes" });
  }
};

export const getBusinessIncomeById = async (req, res) => {
  try {
    const incomeId = req.params.income_id;
    const [result] = await pool.query(
      "SELECT * FROM businessincome WHERE id = $1",
      [incomeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business income not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve business income" });
  }
};

export const updateBusinessIncome = async (req, res) => {
  try {
    const incomeId = req.params.income_id;
    const { title, user_id, amount, category, description, date } = req.body;

    // Basic validation
    if (!user_id || !amount || !date) {
      return res
        .status(400)
        .json({ message: "user_id, amount, and date are required" });
    }

    const result = await pool.query(
      "UPDATE businessincome SET title = $1, user_id = $2, amount = $3, category = $4, description = $5, date = $6 WHERE id = $7 RETURNING *",
      [title, user_id, amount, category, description, date, incomeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business income not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update business income" });
  }
};

export const deleteBusinessIncome = async (req, res) => {
  try {
    const incomeId = req.params.income_id;
    const result = await pool.query(
      "DELETE FROM businessincome WHERE id = $1 RETURNING *",
      [incomeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business income not found" });
    }

    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete business income" });
  }
};
