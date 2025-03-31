import React from "react";
import ExpenseNotes from "../../components/ExpenseNotes";
// import Header from "../../components/Header";
import MainHeader from "../../components/MainHeader";
import Footer from "../../components/Footer/Footer";

const ExpensePage = () => {
  return (
    <div>
      <MainHeader />
      <ExpenseNotes />
      <Footer />
    </div>
  );
};

export default ExpensePage;
