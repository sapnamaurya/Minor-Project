import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import HomePage from "./pages/HomePage";
import MainHeader from "./components/MainHeader";
import ExpenseNotes from "./components/ExpenseNotes";
import ExpensePage from "./pages/ExpensePage";
import MainPage from "./pages/MainPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/mainpage" element={<MainPage />} />
        {/* <Route path="/Main" element={<MainHeader />} /> */}
        <Route path="/Expense" element={<ExpenseNotes />} />

        {/* <Route path="/Expense" element={<ExpensePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
