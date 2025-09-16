import { saveAs } from "file-saver";
import Papa from "papaparse";

function ExportCSV({ expenses }) {
  const handleExport = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  };

  return <button onClick={handleExport}>Export CSV</button>;
}

export default ExportCSV;
