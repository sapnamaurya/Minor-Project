import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layouts";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";

function Income() {
  const { incomes, getIncomes, getBusinessIncomes, deleteIncome, totalIncome } =
    useGlobalContext();
  const [editIncome, setEditIncome] = useState(null);

  const handleEdit = (id) => {
    const toEdit = incomes.find((item) => item.id === id);
    setEditIncome(toEdit);
  };
  useEffect(() => {
    getIncomes();
    getBusinessIncomes();
  }, []);
  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Incomes</h1>
        <h2 className="total-income">
          Total Income:{" "}
          <span>
            <i class="fa-solid fa-indian-rupee-sign"></i>
            {totalIncome()}
          </span>
        </h2>
        <div className="income-content">
          <div className="form-container">
            <Form income={editIncome} />
          </div>
          <div className="incomes">
            {incomes.map((income) => {
              const { id, title, amount, date, category, description, type } =
                income;
              return (
                <IncomeItem
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  amount={amount}
                  date={date}
                  type={type}
                  category={category}
                  indicatorColor="var(--color-green)"
                  handleEdit={handleEdit}
                  deleteItem={deleteIncome}
                />
              );
            })}
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  );
}

const IncomeStyled = styled.div`
  display: flex;
  overflow: auto;
  .total-income {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: 0.5rem;
    span {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--color-green);
    }
  }
  .income-content {
    display: flex;
    gap: 2rem;
    .incomes {
      flex: 1;
      height: 59vh;
      overflow: auto;
      font-size: 17px;
    }
  }
`;

export default Income;
