import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { plus } from "../../utils/Icons";

function ExpenseForm({ expense }) {
  const { addExpense, error, setError, editExpense } = useGlobalContext();

  const [inputState, setInputState] = useState({
    amount: "",
    date: "",
    category_id: "",
    description: "",
  });
  useEffect(() => {
    if (expense) {
      setInputState({
        amount: expense.amount || "",
        date: new Date(expense.date) || "",
        category_id: expense.category_id || "",
        description: expense.description || "",
      });
    }
  }, [expense]);
  const { amount, date, category_id, description } = inputState;

  const handleInput = (name) => (e) => {
    const value =
      name === "amount" ? parseInt(e.target.value) || 0 : e.target.value;

    setInputState({
      ...inputState,
      [name]: value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const expenseData = {
      ...inputState,
      category_id: category_id,
    };

    if (expense) {
      editExpense(expense.expense_id, expenseData);
    } else {
      addExpense(expenseData);
    }

    //   setInputState({
    //     amount: "",
    //     date: "",
    //     category_id: "",
    //     description: "",
    //   });
  };

  return (
    <ExpenseFormStyled onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div className="input-control">
        <input
          value={amount}
          type="text"
          name={"amount"}
          placeholder={"Expense Amount"}
          onChange={handleInput("amount")}
        />
      </div>
      <div className="input-control">
        <DatePicker
          id="date"
          placeholderText="Enter A Date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => {
            setInputState({ ...inputState, date: date });
          }}
        />
      </div>
      <div className="selects input-control">
        <select
          required
          value={category_id}
          name="category_id"
          id="category_id"
          onChange={handleInput("category_id")}
        >
          <option value="" disabled>
            Select Option
          </option>
          <option value={1}>Education</option>
          <option value={2}>Groceries</option>
          <option value={3}>Transportation</option>
          <option value={5}>Shopping</option>
          <option value={6}>Housing & Utilities</option>
          <option value={7}>Food</option>
          <option value={8}>Fitness</option>
        </select>
      </div>

      <div className="input-control">
        <textarea
          name="description"
          value={description}
          placeholder="Add A Reference"
          id="description"
          cols="30"
          rows="4"
          onChange={handleInput("description")}
        ></textarea>
      </div>
      <div className="submit-btn">
        <Button
          name={"Add Expense"}
          icon={plus}
          bPad={".8rem 1.6rem"}
          bRad={"30px"}
          bg={"var(--color-accent"}
          color={"#fff"}
        />
      </div>
    </ExpenseFormStyled>
  );
}

const ExpenseFormStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  input,
  textarea,
  select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 2px solid #fff;
    background: transparent;
    resize: none;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    color: rgba(34, 34, 96, 0.9);
    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }
  }
  .input-control {
    input {
      width: 100%;
    }
  }

  .selects {
    display: flex;
    justify-content: flex-end;
    select {
      color: rgba(34, 34, 96, 0.4);
      &:focus,
      &:active {
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  .submit-btn {
    button {
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      &:hover {
        background: var(--color-green) !important;
      }
    }
  }
`;
export default ExpenseForm;
