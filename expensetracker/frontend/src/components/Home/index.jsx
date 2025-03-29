import React from "react";
import "./style.css";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const handleExplore = () => {
    navigate("/Expense");
  };
  return (
    <>
      <div className="main">
        <div className="hero">
          <h1>
            Welcome to <span>ExpensoMeter</span>
          </h1>

          <p style={{ marginTop: "5%" }}>
            A safe place to keep your expense records.
          </p>
          <h5 style={{ textAlign: "left" }}>
            Let's dive into the following wonderful features:
          </h5>
          <div className="features">
            <ul>
              <li> Categorize your expenses.</li>
              <li>Differentiate by dates.</li>
              <li>Perform mathematical operations on expenses.</li>
            </ul>
          </div>

          <button className="cta-btn" onClick={handleExplore}>
            Explore Here
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
