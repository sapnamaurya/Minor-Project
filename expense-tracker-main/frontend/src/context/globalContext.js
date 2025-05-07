import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  // Personal
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Business
  const [businessIncomes, setBusinessIncomes] = useState([]);
  const [businessExpenses, setBusinessExpenses] = useState([]);

  const [error, setError] = useState(null);

  // --- PERSONAL INCOME ---
  const getIncomes = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/incomes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncomes(res.data);
    } catch (err) {
      setError("Failed to fetch personal incomes");
    }
  };

  const addIncome = async (income) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${BASE_URL}/incomes`, income, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getIncomes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add personal income");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/incomes/${id}`);
      getIncomes();
    } catch (err) {
      setError("Failed to delete personal income");
    }
  };

  // --- PERSONAL EXPENSE ---
  const getExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to fetch personal expenses");
    }
  };

  const addExpense = async (expense) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${BASE_URL}/expenses`, expense, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getExpenses();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to add personal expense"
      );
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/expenses/${id}`);
      getExpenses();
    } catch (err) {
      setError("Failed to delete personal expense");
    }
  };

  // --- BUSINESS INCOME ---
  const getBusinessIncomes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.get(`${BASE_URL}/business/incomes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBusinessIncomes(res.data);
    } catch (err) {
      console.error("Error fetching business incomes:", err);
      setError(
        err?.response?.data?.message || "Failed to fetch business incomes"
      );
    }
  };

  const addBusinessIncome = async (income) => {
    try {
      const token = localStorage.getItem("token"); // Use your actual token key

      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post(`${BASE_URL}/business/incomes`, income, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getBusinessIncomes();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add business income");
    }
  };

  const deleteBusinessIncome = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage

      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.delete(`${BASE_URL}/business/incomes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
        },
      });

      getBusinessIncomes(); // Refresh the business incomes list
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to delete business income"
      );
    }
  };

  // --- BUSINESS EXPENSE ---
  const getBusinessExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const res = await axios.get(`${BASE_URL}/business/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBusinessExpenses(res.data);
    } catch (err) {
      console.error("Error fetching business expenses:", err);
      setError(
        err?.response?.data?.message || "Failed to fetch business expenses"
      );
    }
  };

  const addBusinessExpense = async (expense) => {
    try {
      const token = localStorage.getItem("token"); // Replace with your actual token key
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        `${BASE_URL}/business/expenses`,
        { ...expense },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token to backend
          },
        }
      );

      // update state accordingly...
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Error occurred";
      setError(message);
    }
  };

  const deleteBusinessExpense = async (id) => {
    console.log(id);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${BASE_URL}/business/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getBusinessExpenses();
    } catch (err) {
      setError("Failed to delete business expense");
    }
  };
  // PERSONAL EXPENSE - EDIT
  const editExpense = async (id, updatedExpense) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      await axios.put(`${BASE_URL}/expenses/${id}`, updatedExpense, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in Authorization header
        },
      });

      getExpenses();
    } catch (err) {
      setError("Failed to update personal expense");
    }
  };

  const editIncome = async (id, updatedIncome) => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      await axios.put(`${BASE_URL}/incomes/${id}`, updatedIncome, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      getExpenses();
    } catch (err) {
      setError("Failed to update personal expense");
    }
  };

  // BUSINESS EXPENSE - EDIT
  const editBusinessExpense = async (id, updatedExpense) => {
    try {
      await axios.put(`${BASE_URL}/business/expenses/${id}`, updatedExpense);
      getBusinessExpenses();
    } catch (err) {
      setError("Failed to update business expense");
    }
  };

  // --- CALCULATIONS ---
  const totalIncome = () =>
    incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalExpenses = () =>
    expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalBalance = () => totalIncome() - totalExpenses();

  const totalBusinessIncome = () =>
    businessIncomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalBusinessExpenses = () =>
    businessExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalBusinessBalance = () =>
    totalBusinessIncome() - totalBusinessExpenses();

  const transactionHistory = () => {
    const history = [...incomes, ...expenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  const businessTransactionHistory = () => {
    const history = [...businessIncomes, ...businessExpenses];
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return history.slice(0, 3);
  };

  // --- FETCH INITIAL DATA ---
  useEffect(() => {
    getIncomes();
    getExpenses();
    getBusinessIncomes();
    getBusinessExpenses();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        // Personal
        incomes,
        addIncome,
        editIncome,
        deleteIncome,
        getIncomes,
        expenses,
        addExpense,
        deleteExpense,
        editExpense,
        getExpenses,
        totalIncome,
        totalExpenses,
        totalBalance,
        transactionHistory,

        // Business
        businessIncomes,
        addBusinessIncome,
        deleteBusinessIncome,
        getBusinessIncomes,
        businessExpenses,
        addBusinessExpense,
        deleteBusinessExpense,
        getBusinessExpenses,
        totalBusinessIncome,
        totalBusinessExpenses,
        totalBusinessBalance,
        businessTransactionHistory,

        // Common

        error,
        setError,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
