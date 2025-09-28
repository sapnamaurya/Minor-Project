import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaBuilding, FaUser, FaUsers } from "react-icons/fa"; // icons

const ChoicePage = () => {
  const [choice, setChoice] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (choice) {
      localStorage.setItem("accountType", choice);
      navigate("/register");
    } else {
      alert("Please select an option.");
    }
  };

  return (
    <ChoiceStyled>
      <div className="container">
        <h2>Select Account Type</h2>
        <div className="card-grid">
          <div
            className={`card ${choice === "business" ? "selected" : ""}`}
            onClick={() => setChoice("business")}
          >
            <FaBuilding size={50} />
            <p>Business</p>
          </div>
          <div
            className={`card ${choice === "personal" ? "selected" : ""}`}
            onClick={() => setChoice("personal")}
          >
            <FaUser size={50} />
            <p>Personal</p>
          </div>
          <div
            className={`card ${choice === "team" ? "selected" : ""}`}
            onClick={() => setChoice("team")}
          >
            <FaUsers size={50} />
            <p>Team Budget</p>
          </div>
        </div>
        <button onClick={handleSubmit}>Continue</button>
      </div>
    </ChoiceStyled>
  );
};

const ChoiceStyled = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6fb;

  .container {
    text-align: center;

    h2 {
      margin-bottom: 2rem;
      font-size: 26px;
      color: #333;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
      }

      &.selected {
        border: 2px solid #57007b;
        background: #f9f0ff;
      }

      p {
        margin-top: 1rem;
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }
    }

    button {
      background: #57007b;
      color: white;
      padding: 12px 28px;
      font-size: 18px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #3d005b;
      }
    }
  }
`;

export default ChoicePage;
