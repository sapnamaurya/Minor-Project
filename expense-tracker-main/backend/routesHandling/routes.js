import { Router } from "express";
const router = Router();

import {
  addExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  checkUserTotalLimit,
} from "./controllers/personal/expense.js";
import {
  addIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from "./controllers/personal/income.js";
import {
  registerUser,
  loginUser,
  authenticateUser,
} from "./controllers/personal/authorization.js";

import {
  createBusinessExpense,
  getAllBusinessExpenses,
  getBusinessExpenseById,
  updateBusinessExpense,
  deleteBusinessExpense,
} from "./controllers/business/expense.js";
import {
  createBusinessIncome,
  getAllBusinessIncomes,
  getBusinessIncomeById,
  updateBusinessIncome,
  deleteBusinessIncome,
} from "./controllers/business/income.js";

//Personal Expense Routes
router.post("/expenses", authenticateUser, addExpense);
router.get("/expenses", authenticateUser, getAllExpenses);
router.get("/expenses/category", getExpensesByCategory);
router.get(
  "/expenses/checkUserTotalLimit",
  authenticateUser,
  checkUserTotalLimit
);
router.get("/expenses/:id", getExpenseById);
router.put("/expenses/:id", authenticateUser, updateExpense);
router.delete("/expenses/:id", deleteExpense);

//Personal Income Routes
router.post("/incomes", authenticateUser, addIncome);
router.get("/incomes", authenticateUser, getIncomes);
router.get("/incomes/:id", getIncomeById);
router.put("/incomes/:id", authenticateUser, updateIncome);
router.delete("/incomes/:id", deleteIncome);

// Business Expense Routes
router.post("/business/expenses", authenticateUser, createBusinessExpense);
router.get("/business/expenses", authenticateUser, getAllBusinessExpenses);
router.get("/business/expenses/:expense_id", getBusinessExpenseById);
router.put(
  "/business/expenses/:expense_id",
  authenticateUser,
  updateBusinessExpense
);
router.delete(
  "/business/expenses/:expense_id",
  authenticateUser,
  deleteBusinessExpense
);

// Business Income Routes
router.post("/business/incomes", authenticateUser, createBusinessIncome);
router.get("/business/incomes", authenticateUser, getAllBusinessIncomes);
router.get("/business/incomes/:income_id", getBusinessIncomeById);
router.put(
  "/business/incomes/:income_id",
  authenticateUser,
  updateBusinessIncome
);
router.delete(
  "/business/incomes/:income_id",
  authenticateUser,
  deleteBusinessIncome
);

// Authentication Routes
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

export default router;
