// import React from "react";
// import "./calendarpage.css";
// import { useState, useCallback } from "react";
// import { Calendar } from "@natscale/react-calendar";

// const CalendarPage = () => {
//   const [value, setValue] = useState();

//   const onChange = useCallback(
//     (value) => {
//       setValue(value);
//     },
//     [setValue]
//   );

//   return (
//     <div>
//       <h1>Calendar - GeeksforGeeks</h1>
//       <Calendar className="calendar" value={value} onChange={onChange} />
//     </div>
//   );
// };
import React from "react";
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
