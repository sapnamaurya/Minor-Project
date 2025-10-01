import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "./assests/Images/bg.png";
import { MainLayout } from "./styles/Layouts";
import Orb from "./components/Orb/Orb";
import Navigation from "./components/Navigation/Navigation";
import Dashboard from "./components/Dashboard/Dashboard";
import Income from "./components/Income/Income";
import Expenses from "./components/Expenses/Expenses";
import Login from "./components/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register/Register";
import { AuthProvider } from "./context/authContext";
import Choice from "./components/Choice/Choice";
import MainHome from "./components/Home/Home";
import BusinessDashboard from "./pages/Business/BusinessDashboard";
import BusinessIncome from "./pages/Business//BusinessIncomeFold/BusinessIncome";
import Analysis from "./pages/Analysis/Analysis";
import BusinessExpense from "./pages/Business/BusinessExpense/BusinessExpense";
import DD from "./sample/index";
import CalendarPage from "./shared/CalenderPage";
import TeamExpense from "./shared/TeamExpense";
import ExpenseTable from "./shared/ExpenseTable";
import Header from "./shared/Header/Heaer";
import Chart from "./shared/Chart";

function App() {
  const [active, setActive] = useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      case 5:
        return <Analysis />;
      default:
        return <Dashboard />;
    }
  };
  const businessDisplay = () => {
    switch (active) {
      case 1:
        return <BusinessDashboard />;
      case 2:
        return <BusinessDashboard />;
      case 3:
        return <BusinessIncome />;
      case 4:
        return <BusinessExpense />;
      case 5:
        return <Analysis />;
    }
  };
  const teamDisplay = () => {
    switch (active) {
      case 1:
        return <DD />;
      case 2:
        return <CalendarPage />;
      case 3:
        return <ExpenseTable />;
      case 4:
        return <TeamExpense />;
    }
  };
  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);
  // const Home = () => {
  //   const [date, setDate] = useState(new Date());
  //   const navigate = useNavigate();

  //   // When user clicks a date → go to expense page
  //   const handleDateClick = (d) => {
  //     setDate(d);
  //     navigate("/das", { state: { date: d } });
  //   };
  //   return (
  //     <div style={{ textAlign: "center", marginTop: "50px" }}>
  //       <h1>📅 Select a Date</h1>
  //       <Calendar onClickDay={handleDateClick} value={date} />
  //     </div>
  //   );
  // };
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppStyled bg={bg} className="App">
          {orbMemo}
          <ToastContainer />
          <Routes>
            <Route
              path="/main"
              element={
                <MainLayout>
                  <Navigation active={active} setActive={setActive} />
                  <main>{displayData()}</main>
                </MainLayout>
              }
            />
            <Route
              path="/busi"
              element={
                <MainLayout>
                  <Navigation active={active} setActive={setActive} />
                  <main>{businessDisplay()}</main>
                </MainLayout>
              }
            />
            <Route
              path="/dd"
              element={
                <MainLayout>
                  <Header active={active} setActive={setActive} />
                  <main>{teamDisplay()}</main>
                </MainLayout>
              }
            />
            <Route path="/home" element={<CalendarPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/choice" element={<Choice />} />
            // <Route path="/" element={<MainHome />} />
            <Route path="/nan" element={<Analysis />} />
            <Route path="/" element={<MainHome />} />
            <Route path="/dd" element={<DD />} />
            <Route path="/team" element={<TeamExpense />} />
            <Route path="/table" element={<ExpenseTable />} />
            <Route path="/chart" element={<Chart />} />
          </Routes>
        </AppStyled>
      </BrowserRouter>
    </AuthProvider>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
