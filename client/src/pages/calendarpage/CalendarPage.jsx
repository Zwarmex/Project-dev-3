import "./calendarpage.css";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarPage = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <h1>Planifier vos repas de la semaine</h1>
      <Calendar className="calendar" onChange={onChange} value={value} />
    </div>
  );
};

export default CalendarPage;
