import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pie, Line } from "react-chartjs-2";

function ExportPDF({ expenses, pieData, lineData }) {
  const pieRef = useRef(null);
  const lineRef = useRef(null);

  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(16);
    doc.text(`Expenses Report - ${new Date().toDateString()}`, 14, 15);

    // Member Contributions table
    autoTable(doc, {
      startY: 20,
      head: [["Purpose", "Description", "Member", "Amount"]],
      body: expenses.map((e) => [
        e.purpose,
        e.description,
        e.member,
        `$${e.amount}`,
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [100, 100, 255] },
    });

    // Category Expenses table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 3,
      head: [["Purpose", "Category", "Amount"]],
      body: expenses.map((e) => [e.purpose, e.category, `$${e.amount}`]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [100, 100, 255] },
    });

    // Charts inline
    const chartsStartY = doc.lastAutoTable.finalY + 5;
    const chartWidth = 90; // half page width
    const chartHeight = 60; // adjust as needed

    // Line Chart
    const lineCanvas = lineRef.current.canvas;
    const lineImg = lineCanvas.toDataURL("image/png", 1.0);
    doc.text("Expenses Trend", 14, chartsStartY);
    doc.addImage(lineImg, "PNG", 14, chartsStartY + 3, chartWidth, chartHeight);

    // Pie Chart
    const pieCanvas = pieRef.current.canvas;
    const pieImg = pieCanvas.toDataURL("image/png", 1.0);
    doc.text("Category Distribution", 110, chartsStartY);
    doc.addImage(pieImg, "PNG", 110, chartsStartY + 3, chartWidth, chartHeight);

    // Page Number
    doc.setFontSize(10);
    doc.text(
      `Page 1 of 1`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );

    // Save PDF
    doc.save(`expenses-${new Date().toDateString()}.pdf`);
  };

  return (
    <div>
      <button
        onClick={exportPDF}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        Export PDF
      </button>

      {/* Hidden charts */}
      <div style={{ display: "none" }}>
        <Line ref={lineRef} data={lineData} />
        <Pie ref={pieRef} data={pieData} />
      </div>
    </div>
  );
}

export default ExportPDF;
