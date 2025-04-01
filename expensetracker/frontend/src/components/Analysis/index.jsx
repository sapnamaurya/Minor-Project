import React, { useEffect, useState } from "react";
import MainHeader from "../MainHeader";
import Footer from "../Footer/Footer";

const Analysis = () => {
  const [loading, setLoading] = useState(true);

  // You can remove the fetch logic for output.txt if it's not needed
  useEffect(() => {
    // Set loading state to false once everything is loaded (optional)
    setLoading(false);
  }, []);

  return (
    <>
      <MainHeader />
      <div className="analysis-cont">
        <h2>Expense Analysis</h2>
        {/* Display loading message while data is being fetched */}
        {loading && <p>Loading analysis...</p>}

        {/* Show the bar chart */}
        <img
          src="/bar_chart.png"
          alt="Expense Bar Chart"
          style={{ maxWidth: "100%", marginTop: "20px" }}
        />
        
        {/* Show the pie chart */}
        <img
          src="/pie_chart.png"
          alt="Expense Pie Chart"
          style={{ maxWidth: "100%", marginTop: "20px" }}
        />
      </div>
      <Footer />
    </>
  );
};

export default Analysis;
