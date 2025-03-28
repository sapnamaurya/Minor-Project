import React from "react";
import ExpenseNotes from "../../components/ExpenseNotes";
// import Header from "../../components/Header";
import MainHeader from "../../components/MainHeader";

const ExpensePage = () => {
  return (
    <div>
      <MainHeader />
      <ExpenseNotes />
    </div>
  );
};

export default ExpensePage;
