import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register/index.jsx";
import MainPage from "./pages/MainPage/index.jsx";
import HomePage from "./pages/HomePage";
import ExpenseNotes from "./components/ExpenseNotes";
import ExpenseAnalysis from "./components/Analysis/index.jsx";
// import ExpenseEntry from "./components/ExpenseNotes";
import { useState } from "react";
import Footer from "./components/Footer/Footer.jsx";
// import MainHeader from "./components/MainHeader";
function App() {
  // const [expenses, setExpenses] = useState([]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/expense" element={<ExpenseNotes />} />
        {/* <Route
          path="/entry"
          element={
            <ExpenseEntry expenses={expenses} setExpenses={setExpenses} />
          }
        /> */}
        <Route path="/footer" element={<Footer />} />

        <Route path="/analysis" element={<ExpenseAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
