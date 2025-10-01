import React, { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Pie, Line } from "react-chartjs-2";

function ExportPDF({ expenses, pieData, lineData }) {
  const pieRef = useRef(null);
  const lineRef = useRef(null);

  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 10);

    // Add Table
    autoTable(doc, {
      startY: 20,
      head: [["Member", "Category", "Amount"]],
      body: expenses.map((exp) => [exp.member, exp.category, exp.amount]),
    });

    let finalY = doc.lastAutoTable.finalY || 30;

    // Add Pie Chart
    const pieCanvas = pieRef.current?.canvas;
    if (pieCanvas) {
      const pieImage = pieCanvas.toDataURL("image/png");
      doc.addImage(pieImage, "PNG", 15, finalY + 10, 80, 80);
    }

    // Add Line Chart
    const lineCanvas = lineRef.current?.canvas;
    if (lineCanvas) {
      const lineImage = lineCanvas.toDataURL("image/png");
      doc.addImage(lineImage, "PNG", 110, finalY + 10, 80, 80);
    }

    doc.save("expenses.pdf");
  };

  return (
    <div>
      {/* Hidden charts just for export */}
      <div style={{ display: "none" }}>
        <Pie ref={pieRef} data={pieData} />
        <Line ref={lineRef} data={lineData} />
      </div>

      <button
        onClick={handleExport}
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: "none",
          background: "#198754",
          color: "white",
          cursor: "pointer",
        }}
      >
        📝 Export PDF
      </button>
    </div>
  );
}

export default ExportPDF;
