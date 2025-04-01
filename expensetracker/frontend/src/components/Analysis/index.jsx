import React, { useState, useEffect } from "react";
import MainHeader from "../MainHeader";
import Footer from "../Footer/Footer";

const Analysis = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading state to false once everything is loaded (optional)
    setLoading(false);
  }, []);

  return (
    <>
      <MainHeader />
      <div className="analysis-cont" style={{ textAlign: "center", marginTop: "40px" }}>
        {/* Center align the heading */}
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "30px" }}>
          Expense Tracker - Analysis
        </h2>

        {/* Display loading message while data is being fetched */}
        {loading && <p>Loading analysis...</p>}

        {/* Flex container for charts with increased gap between them */}
        <div className="charts-container" style={{ display: 'flex', justifyContent: 'center', gap: '80px', alignItems: 'center' }}>
          {/* Bar Chart */}
          <img
            src="/bar_chart.png"
            alt="Expense Bar Chart"
            style={{
              width: '35%', // Resize the charts to smaller size
              marginTop: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              maxWidth: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Medium opacity white background
              opacity: 1  // Ensure it's not fully transparent
            }}
          />
          
          {/* Pie Chart */}
          <img
            src="/pie_chart.png"
            alt="Expense Pie Chart"
            style={{
              width: '35%', // Resize the charts to smaller size
              marginTop: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              maxWidth: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',  // Medium opacity white background
              opacity: 1  // Ensure it's not fully transparent
            }}
          />
        </div>

        {/* Gap between charts and footer */}
        <div style={{ marginBottom: '30px' }}></div>
      </div>
      <Footer />
    </>
  );
};

export default Analysis;
