import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({ expenses }) {
  const handleExport = () => {
    const doc = new jsPDF();
    doc.text("Expense Report", 14, 10);

    doc.autoTable({
      startY: 20,
      head: [["Member", "Category", "Amount"]],
      body: expenses.map((exp) => [exp.member, exp.category, exp.amount]),
    });

    doc.save("expenses.pdf");
  };

  return <button onClick={handleExport}>Export PDF</button>;
}

export default ExportPDF;
