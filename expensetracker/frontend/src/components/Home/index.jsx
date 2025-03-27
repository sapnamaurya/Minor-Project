import React from "react";
import "./style.css";
// import bg_img from "../../assests/Images/black-mamba.png";

const Home = () => {
  return (
    <>
      <div className="main">
        {/* <div className="main-cont">
          <h1 style={{ textAlign: "center" }}>Welcome To</h1>
          <h1 style={{ textAlign: "center" }} className="app-name">
            ExpensoMeter
          </h1>
          <p className="title">A safe place to keep your expense record.</p>
          <h5>Let's dive into the following wonderful features:</h5>
          <ul>
            <li> Categorize your expenses.</li>
            <li>Differentiate by dates.</li>
            <li>Perform mathematical operations on expenses.</li>
          </ul>
        </div> */}

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

          <button className="cta-btn">Explore Here</button>
        </div>
      </div>
    </>
  );
};

export default Home;
