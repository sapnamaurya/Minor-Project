import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDateClick = (d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDate = new Date(d);
    clickedDate.setHours(0, 0, 0, 0);

    setDate(d);

    if (clickedDate < today) {
      navigate("/table", { state: { date: d } }); // Past → read-only
    } else {
      navigate("/team", { state: { date: d } }); // Today/Future → editable
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📅 Select a Date</h2>
        <Calendar
          onClickDay={handleDateClick}
          value={date}
          minDate={null}
          style={styles.calendar}
        />
      </div>
    </div>
  );
};

export default CalendarPage;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#343a40",
  },
  calendar: {
    borderRadius: "12px",
    overflow: "hidden",
  },
};
